import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentProcessingStateMachine, CommentProcessingJobState } from "./comment-processing-state-machine.service"
import { CommentProcessingService, ProcessingResultBatch } from "./comment-processing.service"
import { LeadCandidateBuilder, LeadCandidate } from "./lead-candidate-builder.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface CollectionBatchTask {
  batchId: string
  targetId: string
  rawComments: Array<{ commentId: string; authorId: string; text: string; timestamp?: Date }>
  customKeywords?: string[]
}

@Injectable()
export class CommentProcessingJobCoordinator extends BaseJobCoordinator<CommentProcessingJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: CommentProcessingStateMachine,
    private readonly processingService: CommentProcessingService,
    private readonly leadCandidateBuilder: LeadCandidateBuilder,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateProcessing(
    job: AutomationJob,
    accountId: string,
    task: CollectionBatchTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; resultBatch?: ProcessingResultBatch; leads?: LeadCandidate[]; reason?: string }> {
    const jobId = job.id
    console.log(`[CommentProcessingCoordinator] Consuming batch ${task.batchId} (${task.rawComments.length} comments) for Job ${jobId}`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "CollectionBatchConsumed", `Consumed batch ${task.batchId}`)

    // 1. Validation & Pacing Context
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_processing || 100,
      hourlyBudget: 20,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.COMMENT_PROCESSING
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }

    // 2. Distributed Lock format: lock:${workspaceId}:${accountId}:comment_processing:${batchId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:comment_processing:${task.batchId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", task)

      // 3. Enqueue to Processing Queue & Execute Processing
      await this.stateMachine.transition(jobId, "ProcessingQueueEnqueued", "Batch enqueued into Processing queue")
      await this.queueAdapter.enqueue("scheduler", job)

      const resultBatch = this.processingService.processBatch(task.batchId, task.rawComments)
      await this.stateMachine.transition(jobId, "CommentsProcessed", `Processed ${resultBatch.processedCount} comments (${resultBatch.duplicatesRemoved} duplicates removed)`)

      // 4. Lead Scoring & Lead Candidates Generation
      const leads = resultBatch.comments.map((c) => this.leadCandidateBuilder.buildLeadCandidate(c, task.customKeywords || []))
      await this.stateMachine.transition(jobId, "LeadsScored", `Scored ${leads.length} lead candidates`)

      await this.stateMachine.transition(jobId, "LeadQueueEnqueued", "Leads enqueued into Lead Candidate queue")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", { batchId: task.batchId, leadCount: leads.length })

      await this.stateMachine.transition(jobId, "Verified", "Processing batch verified")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Processing batch reported")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Comment Processing & Lead Extraction foundation completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", { batchId: task.batchId, leadCount: leads.length })

      return { success: true, resultBatch, leads }
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
      name: `CommentProcessing_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "CommentProcessingJobCoordinator",
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
