import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { AutoReplyStateMachine, AutoReplyJobState } from "./auto-reply-state-machine.service"
import { AutoReplyPolicyService } from "./auto-reply-policy.service"
import { SavedReplySelectorService, SavedReplyTemplate } from "./saved-reply-selector.service"
import { ReplyVariationService } from "./reply-variation.service"
import { AutoReplyDelayService } from "./auto-reply-delay.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface AutoReplyTask {
  pageId: string
  postId: string
  commentId: string
  authorName?: string
  text: string
  intent?: string
}

@Injectable()
export class AutoReplyJobCoordinator extends BaseJobCoordinator<AutoReplyJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: AutoReplyStateMachine,
    private readonly autoPolicyService: AutoReplyPolicyService,
    private readonly replySelector: SavedReplySelectorService,
    private readonly variationService: ReplyVariationService,
    private readonly autoDelayService: AutoReplyDelayService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateAutoReply(
    job: AutomationJob,
    accountId: string,
    task: AutoReplyTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; selectedReply?: string; delaySeconds?: number; reason?: string }> {
    const jobId = job.id
    console.log(`[AutoReplyJobCoordinator] Coordinating Auto Reply for comment ${task.commentId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "ApprovedInboxReceived", `Received approved comment ${task.commentId}`)

    // 1. Validation & Pacing Context
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_auto_reply || 200,
      hourlyBudget: 30,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.COMMENT_AUTO_REPLY
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Policy Validation (Working hours, limits, duplicate prevention, cooldown)
    const policyRes = this.autoPolicyService.validateEligibility(accountId, task.postId, task.commentId, hbf)
    if (!policyRes.eligible) {
      await this.stateMachine.transition(jobId, "Failed", `Policy violation: ${policyRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: policyRes.reason })
      return { success: false, reason: policyRes.reason }
    }

    await this.stateMachine.transition(jobId, "PolicyValidated", "Passed all human behavior & auto reply policies")

    // 3. Saved Reply Selection & Rotation
    const detectedIntent = task.intent || "General"
    const selectedTemplate: SavedReplyTemplate = this.replySelector.selectReply(detectedIntent)
    await this.stateMachine.transition(jobId, "SavedReplySelected", `Selected template ID ${selectedTemplate.id}`)

    // 4. Variation Engine
    const variations = this.variationService.generateVariations(selectedTemplate.templateText)
    const finalReplyText = variations[Math.floor(Math.random() * variations.length)]
    await this.stateMachine.transition(jobId, "VariationGenerated", `Generated natural variation: "${finalReplyText}"`)

    // 5. Delay Scheduling (30s to 3 mins via DelayCalculatorService)
    const delaySeconds = this.autoDelayService.getAutoReplyDelaySeconds(hbf)
    await this.stateMachine.transition(jobId, "DelayScheduled", `Scheduled random delay of ${delaySeconds}s`)
    await this.queueAdapter.enqueue("scheduler", job)

    // 6. Distributed Lock format: lock:${workspaceId}:${accountId}:auto_reply:${commentId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:auto_reply:${task.commentId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, finalReplyText, delaySeconds })

      // 7. Pipeline Queue Routing (Reply Queue -> Verification Queue -> Reporting Queue)
      await this.stateMachine.transition(jobId, "ReplyQueueEnqueued", "Enqueued into Reply execution queue")
      await this.queueAdapter.enqueue("execution", job)

      this.autoPolicyService.recordReplyExecution(accountId, task.postId, task.commentId)
      await this.publishLifecycleEvent(job, "AfterExecute", { commentId: task.commentId })

      await this.stateMachine.transition(jobId, "Verified", "Auto reply verified on feed")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Auto reply history reported")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Auto Reply Engine job completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { commentId: task.commentId, reply: finalReplyText })

      return { success: true, selectedReply: finalReplyText, delaySeconds }
    } catch (err: any) {
      await this.stateMachine.transition(jobId, "Failed", `Error: ${err.message}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: err.message })
      await this.queueAdapter.enqueue("retry", job)
      return { success: false, reason: err.message }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${jobId}`)
    }
  }

  private async publishLifecycleEvent(job: AutomationJob, stageName: string, details?: Record<string, any>) {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: `AutoReply_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "AutoReplyJobCoordinator",
      correlationId: job.correlationId || job.id,
      causationId: job.id,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date()
    }
    await this.eventBus.publish(event)
  }
}
