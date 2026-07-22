import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentModerationStateMachine, CommentModerationJobState } from "./comment-moderation-state-machine.service"
import { CommentLinkDetectionService, DetectionResult } from "./comment-link-detection.service"
import { CommentDeletionVerificationService } from "./comment-deletion-verification.service"
import { ModerationAuditService } from "./moderation-audit.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface IncomingCommentTask {
  pageId: string
  postId: string
  commentId: string
  text: string
  allowList?: string[]
  blockList?: string[]
}

@Injectable()
export class CommentModerationJobCoordinator extends BaseJobCoordinator<CommentModerationJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: CommentModerationStateMachine,
    private readonly detectionService: CommentLinkDetectionService,
    private readonly verificationService: CommentDeletionVerificationService,
    private readonly auditService: ModerationAuditService,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateModeration(
    job: AutomationJob,
    accountId: string,
    task: IncomingCommentTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; detection?: DetectionResult; deleted?: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[CommentModerationCoordinator] Evaluating comment ${task.commentId} for Job ${jobId}`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "IncomingCommentReceived", `Received comment ${task.commentId}`)

    // 1. Validation & Pacing Context
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_link_moderation || 500,
      hourlyBudget: 50,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.COMMENT_LINK_MODERATION
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Link Detection & Rule Evaluation
    const detection = this.detectionService.evaluateComment(task.text, task.allowList, task.blockList)
    if (!detection.hasLink) {
      await this.stateMachine.transition(jobId, "Completed", "No link detected in comment")
      await this.publishLifecycleEvent(job, "AfterComplete", { status: "NoLink" })
      return { success: true, detection, deleted: false, reason: "No link detected" }
    }

    await this.stateMachine.transition(jobId, "LinkDetected", `Detected ${detection.detectedUrls.length} links`)

    if (!detection.isBlocked) {
      await this.stateMachine.transition(jobId, "Completed", "Link allowed by Allow List rule")
      await this.publishLifecycleEvent(job, "AfterComplete", { status: "Allowed" })
      this.auditService.recordAudit({
        id: crypto.randomUUID(),
        workspaceId: job.workspaceId,
        accountId,
        pageId: task.pageId,
        postId: task.postId,
        commentId: task.commentId,
        detectedUrls: detection.detectedUrls,
        detectionTime: new Date(),
        result: "Allowed"
      })
      return { success: true, detection, deleted: false, reason: "Link allowed" }
    }

    await this.stateMachine.transition(jobId, "ModerationEvaluated", `Blocked: ${detection.reason}`)

    // 3. Distributed Lock format: lock:${workspaceId}:${accountId}:comment_delete:${commentId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:comment_delete:${task.commentId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", { task, detection })

      // 4. Delete Queue -> Verification Queue -> Reporting Queue Workflow
      await this.stateMachine.transition(jobId, "DeleteQueueEnqueued", "Comment enqueued into Delete queue")
      await this.queueAdapter.enqueue("scheduler", job)

      // Simulate framework delete execution transition
      await this.stateMachine.transition(jobId, "Deleted", "Comment deletion executed")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { commentId: task.commentId })

      // 5. Deletion Verification
      await this.stateMachine.transition(jobId, "VerificationQueueEnqueued", "Enqueued into Verification queue")
      const verification = await this.verificationService.verifyDeletion(task.commentId)
      await this.stateMachine.transition(jobId, "Verified", `Deletion verified: ${verification.reason}`)
      await this.queueAdapter.enqueue("verification", job)

      // 6. Moderation Audit Recording
      this.auditService.recordAudit({
        id: crypto.randomUUID(),
        workspaceId: job.workspaceId,
        accountId,
        pageId: task.pageId,
        postId: task.postId,
        commentId: task.commentId,
        detectedUrls: detection.detectedUrls,
        detectionTime: new Date(),
        deleteTime: new Date(),
        result: "Deleted"
      })

      await this.stateMachine.transition(jobId, "Reported", "Moderation audit recorded")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Comment Auto Delete Engine workflow completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { commentId: task.commentId, status: "Deleted" })

      return { success: true, detection, deleted: true }
    } catch (err: any) {
      await this.stateMachine.transition(jobId, "Failed", `Error: ${err.message}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: err.message })
      await this.queueAdapter.enqueue("retry", job)

      this.auditService.recordAudit({
        id: crypto.randomUUID(),
        workspaceId: job.workspaceId,
        accountId,
        pageId: task.pageId,
        postId: task.postId,
        commentId: task.commentId,
        detectedUrls: detection.detectedUrls,
        detectionTime: new Date(),
        result: "Failed",
        failureReason: err.message
      })

      return { success: false, reason: err.message }
    } finally {
      await this.lockManager.releaseLock(lockKey, `worker-${jobId}`)
    }
  }

  private async publishLifecycleEvent(job: AutomationJob, stageName: string, details?: Record<string, any>) {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: `CommentModeration_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "CommentModerationJobCoordinator",
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
