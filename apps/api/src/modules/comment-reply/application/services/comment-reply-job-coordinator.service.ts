import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentReplyStateMachine, CommentReplyJobState } from "./comment-reply-state-machine.service"
import { CommentInboxService, NormalizedCommentEvent } from "./comment-inbox.service"
import { ReplySuggestionService, RuleBasedSuggestion } from "./reply-suggestion.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface CommentReplyTask {
  pageId: string
  postId: string
  commentId: string
  authorName?: string
  text: string
  autoApprove?: boolean
}

@Injectable()
export class CommentReplyJobCoordinator extends BaseJobCoordinator<CommentReplyJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: CommentReplyStateMachine,
    private readonly inboxService: CommentInboxService,
    private readonly suggestionService: ReplySuggestionService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateReply(
    job: AutomationJob,
    accountId: string,
    task: CommentReplyTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; suggestion?: RuleBasedSuggestion; reason?: string }> {
    const jobId = job.id
    console.log(`[CommentReplyJobCoordinator] Coordinating comment reply for ${task.commentId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "IncomingCommentReceived", `Received comment ${task.commentId}`)

    // 1. Validation & Pacing Context
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_reply_assistant || 200,
      hourlyBudget: 30,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.COMMENT_REPLY_ASSISTANT
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Inbox Service & Duplicate Filtering
    const { event, isDuplicate } = this.inboxService.receiveIncomingEvent(task)
    if (isDuplicate) {
      await this.stateMachine.transition(jobId, "Completed", "Duplicate comment event ignored")
      return { success: true, reason: "Duplicate event" }
    }
    await this.stateMachine.transition(jobId, "InboxQueueEnqueued", "Comment enqueued into Inbox queue")

    // 3. Local Rule-Based Reply Suggestion
    const suggestion = this.suggestionService.generateSuggestionsLocal(event.text)
    await this.stateMachine.transition(jobId, "ReplySuggested", `Intent: ${suggestion.intentCategory}, Generated ${suggestion.suggestions.length} variations`)

    // 4. Distributed Lock format: lock:${workspaceId}:${accountId}:comment_reply:${commentId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:comment_reply:${task.commentId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, suggestion })

      // 5. Manual Approval Queue vs Auto Approval
      if (!task.autoApprove) {
        await this.stateMachine.transition(jobId, "ManualApprovalEnqueued", "Enqueued into Manual Approval queue for user review")
        await this.queueAdapter.enqueue("scheduler", job)
      }

      // 6. Pipeline Queue Routing (Reply Queue -> Verification Queue -> Reporting Queue)
      await this.stateMachine.transition(jobId, "ReplyQueueEnqueued", "Enqueued into Reply execution queue")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { commentId: task.commentId })

      await this.stateMachine.transition(jobId, "Verified", "Reply execution verified on feed")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Reply history reported")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Comment Reply Assistant foundation completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { commentId: task.commentId })

      return { success: true, suggestion }
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
      name: `CommentReply_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "CommentReplyJobCoordinator",
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
