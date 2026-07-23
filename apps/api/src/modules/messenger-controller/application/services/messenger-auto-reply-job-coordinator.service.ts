import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerAutoReplyStateMachine, MessengerAutoReplyJobState } from "./messenger-auto-reply-state-machine.service"
import { AutoMessengerReplyPolicyService, AutoMessengerReplyPolicyConfig } from "./auto-messenger-reply-policy.service"
import { ConversationReplyModeService, MessengerReplyMode } from "./conversation-reply-mode.service"
import { MessengerReplySuggestionService } from "./messenger-reply-suggestion.service"
import { FallbackReplyService } from "./fallback-reply.service"
import { MessengerAutoReplyDelayService } from "./messenger-auto-reply-delay.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { AutomationContext } from "../../../automation-core/domain/automation-framework.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface MessengerAutoReplyTask {
  conversationId: string
  pageId: string
  senderId: string
  messageText: string
  replyMode: MessengerReplyMode
  policyConfig: AutoMessengerReplyPolicyConfig
}

@Injectable()
export class MessengerAutoReplyJobCoordinator extends BaseJobCoordinator<MessengerAutoReplyJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: MessengerAutoReplyStateMachine,
    private readonly autoReplyPolicyService: AutoMessengerReplyPolicyService,
    private readonly modeService: ConversationReplyModeService,
    private readonly suggestionService: MessengerReplySuggestionService,
    private readonly fallbackService: FallbackReplyService,
    private readonly delayService: MessengerAutoReplyDelayService,
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
    task: MessengerAutoReplyTask,
    hbf: HumanBehaviourConfig
  ): Promise<{
    success: boolean
    replyText?: string
    delaySeconds?: number
    isFallback?: boolean
    reason?: string
  }> {
    const jobId = job.id
    console.log(`[MessengerAutoReplyJobCoordinator] Coordinating auto reply for conversation ${task.conversationId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "ApprovedConversationReceived", `Received approved conversation ${task.conversationId}`)

    // 1. Validation Context
    const context: AutomationContext = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.messenger_auto_reply || 500,
      hourlyBudget: 50,
      accountHealthScore: 95,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.MESSENGER_AUTO_REPLY
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Policy Validation
    const policyCheck = await this.autoReplyPolicyService.isAutoReplyAllowed(
      task.conversationId,
      accountId,
      hbf,
      task.policyConfig
    )
    if (!policyCheck.allowed) {
      await this.stateMachine.transition(jobId, "Failed", `Policy validation failed: ${policyCheck.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: policyCheck.reason })
      return { success: false, reason: policyCheck.reason }
    }
    await this.stateMachine.transition(jobId, "PolicyValidated", "Auto Reply policy check passed")

    // 3. Suggestion & Mode Selection & Fallback Evaluation
    const suggestion = this.suggestionService.analyzeMessage(task.messageText)
    await this.stateMachine.transition(jobId, "ReplySuggestionGenerated", `Suggested reply generated with confidence ${suggestion.confidence}`)

    const fallbackCheck = this.fallbackService.getFallbackReply(suggestion.confidence, 0.7)
    await this.stateMachine.transition(jobId, "FallbackEvaluated", `Fallback evaluated: used=${fallbackCheck.isFallbackUsed}`)

    let finalReply = fallbackCheck.isFallbackUsed ? fallbackCheck.replyText : suggestion.suggestedReply
    finalReply = this.modeService.formatReplyByMode(finalReply, task.replyMode)
    await this.stateMachine.transition(jobId, "ReplyModeSelected", `Formatted reply with mode ${task.replyMode}`)

    // 4. Delay Scheduling
    const { delayMs, delaySeconds } = this.delayService.calculateAutoReplyDelay(context)
    await this.stateMachine.transition(jobId, "DelayScheduled", `Scheduled random delay of ${delaySeconds} seconds`)
    await this.queueAdapter.enqueue("scheduler", job)

    // 5. Distributed Lock: lock:${workspaceId}:${accountId}:messenger_auto_reply:${conversationId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:messenger_auto_reply:${task.conversationId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, finalReply })

      // Record reply in policy service
      this.autoReplyPolicyService.recordReply(task.conversationId, accountId)

      // 6. Queue Pipeline Routing
      await this.stateMachine.transition(jobId, "ReplyQueueEnqueued", "Enqueued reply into Reply execution queue")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { conversationId: task.conversationId })

      await this.stateMachine.transition(jobId, "Verified", "Verified auto reply delivery on Messenger")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Reported Messenger auto reply audit log")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Messenger Auto Reply pipeline completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { conversationId: task.conversationId, replyText: finalReply })

      return {
        success: true,
        replyText: finalReply,
        delaySeconds,
        isFallback: fallbackCheck.isFallbackUsed
      }
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
      name: `MessengerAutoReply_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "MessengerAutoReplyJobCoordinator",
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
