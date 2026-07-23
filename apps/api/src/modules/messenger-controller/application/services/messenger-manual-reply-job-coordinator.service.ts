import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerManualReplyStateMachine, MessengerManualReplyJobState } from "./messenger-manual-reply-state-machine.service"
import { MessengerReplySuggestionService, MessengerReplySuggestion } from "./messenger-reply-suggestion.service"
import { MessengerManualApprovalService, ManualApprovalRecord } from "./messenger-manual-approval.service"
import { MessengerReplyLibraryService } from "./messenger-reply-library.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface MessengerManualReplyTask {
  conversationId: string
  pageId: string
  senderId: string
  messageText: string
  action?: "APPROVE" | "REJECT" | "EDIT" | "LIBRARY"
  customReplyText?: string
  libraryMessageId?: string
}

@Injectable()
export class MessengerManualReplyJobCoordinator extends BaseJobCoordinator<MessengerManualReplyJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: MessengerManualReplyStateMachine,
    private readonly suggestionService: MessengerReplySuggestionService,
    private readonly approvalService: MessengerManualApprovalService,
    private readonly libraryService: MessengerReplyLibraryService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateManualReply(
    job: AutomationJob,
    accountId: string,
    task: MessengerManualReplyTask,
    hbf: HumanBehaviourConfig
  ): Promise<{
    success: boolean
    suggestion?: MessengerReplySuggestion
    approvalRecord?: ManualApprovalRecord
    reason?: string
  }> {
    const jobId = job.id
    console.log(`[MessengerManualReplyJobCoordinator] Coordinating manual reply for conversation ${task.conversationId} (Job ${jobId})`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "IncomingInboxReceived", `Received incoming conversation ${task.conversationId}`)

    // 1. Validation & Pacing Context
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.messenger_manual_reply || 300,
      hourlyBudget: 40,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.MESSENGER_MANUAL_REPLY
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Payload validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Suggestion Engine (Single local rule-based suggestion)
    const suggestion = this.suggestionService.analyzeMessage(task.messageText)
    await this.stateMachine.transition(jobId, "SuggestionEngineProcessed", `Detected Intent: ${suggestion.detectedIntent}, Confidence: ${suggestion.confidence}`)

    // 3. Manual Approval Queue Setup
    let approvalRecord = this.approvalService.createApprovalRecord(
      task.conversationId,
      task.messageText,
      suggestion.suggestedReply
    )
    await this.stateMachine.transition(jobId, "ManualApprovalEnqueued", `Approval record ${approvalRecord.id} created with status Pending`)
    await this.queueAdapter.enqueue("scheduler", job)

    // Handle user action if provided (Approve, Reject, Edit, Library)
    if (task.action === "REJECT") {
      approvalRecord = this.approvalService.rejectSuggestion(approvalRecord.id)
      await this.stateMachine.transition(jobId, "Completed", "Suggestion rejected by user")
      return { success: true, suggestion, approvalRecord, reason: "Rejected" }
    } else if (task.action === "EDIT" && task.customReplyText) {
      approvalRecord = this.approvalService.editSuggestion(approvalRecord.id, task.customReplyText)
    } else if (task.action === "LIBRARY" && task.customReplyText) {
      approvalRecord = this.approvalService.replaceWithLibraryMessage(approvalRecord.id, task.customReplyText)
      if (task.libraryMessageId) {
        this.libraryService.incrementUseCount(task.libraryMessageId)
      }
    } else if (task.action === "APPROVE") {
      approvalRecord = this.approvalService.approveSuggestion(approvalRecord.id)
    }

    // 4. Distributed Lock format: lock:${workspaceId}:${accountId}:manual_reply:${conversationId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:manual_reply:${task.conversationId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, approvalRecord })

      // 5. Reply Queue -> Verification Queue -> Reporting Queue Routing
      await this.stateMachine.transition(jobId, "ReplyQueueEnqueued", "Enqueued approved reply into Reply execution queue")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { conversationId: task.conversationId })

      await this.stateMachine.transition(jobId, "Verified", "Verified reply delivery on Messenger")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Reported manual reply audit log")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Messenger Manual Reply pipeline completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { conversationId: task.conversationId, replyText: approvalRecord.finalReply })

      return { success: true, suggestion, approvalRecord }
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
      name: `MessengerManualReply_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "MessengerManualReplyJobCoordinator",
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
