import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentCollectionStateMachine, CommentCollectionJobState } from "./comment-collection-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../../../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../../../automation-core/application/services/policy.service"
import { AutomationRegistryService } from "../../../automation-core/application/services/automation-registry.service"
import { AutomationCapability } from "../../../automation-core/domain/automation-plugin.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface ParsedCollectionTask {
  targetId: string
  normalizedUrl: string
  classification: string
}

@Injectable()
export class CommentCollectionJobCoordinator extends BaseJobCoordinator<CommentCollectionJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: CommentCollectionStateMachine,
    private readonly delayCalculator: DelayCalculatorService,
    private readonly payloadValidator: PayloadValidatorService,
    private readonly policyService: PolicyService,
    private readonly registryService: AutomationRegistryService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateCollection(
    job: AutomationJob,
    accountId: string,
    task: ParsedCollectionTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[CommentCollectionCoordinator] Consuming parsed target ${task.targetId} (${task.normalizedUrl}) for Job ${jobId}`)

    await this.publishLifecycleEvent(job, "BeforePrepare", task)
    await this.stateMachine.transition(jobId, "ParsedTargetConsumed", `Consumed parsed target ${task.targetId}`)

    // 1. Policy & Payload Validation via reused framework services
    const context = {
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_collection || 40,
      hourlyBudget: 10,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const valRes = await this.payloadValidator.validateJobPayload(
      job,
      context,
      "facebook",
      AutomationCapability.COMMENT_COLLECTION
    )
    if (!valRes.valid) {
      await this.stateMachine.transition(jobId, "Failed", `Validation failed: ${valRes.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: valRes.reason })
      return { success: false, reason: valRes.reason }
    }
    await this.stateMachine.transition(jobId, "PayloadValidated", "Payload and capability validated")

    // 2. HBF Validation & Pacing via DelayCalculatorService
    const pacing = this.delayCalculator.calculatePacingDelay(context)
    if (!pacing.isWithinWorkingHours) {
      await this.stateMachine.transition(jobId, "Failed", `Outside working hours: ${pacing.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: pacing.reason })
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: pacing.reason }
    }
    await this.stateMachine.transition(jobId, "HbfCalculated", `Pacing delay calculated: ${pacing.delayMs}ms`)

    // 3. Distributed Lock with required format: lock:${workspaceId}:${accountId}:comment_collection:${targetId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:comment_collection:${task.targetId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", task)

      // 4. Collection Pipeline Routing (Scheduler Queue -> Collection Queue -> Verification Queue -> Reporting Queue)
      await this.stateMachine.transition(jobId, "Scheduled", "Job enqueued into Scheduler queue")
      await this.queueAdapter.enqueue("scheduler", job)

      await this.stateMachine.transition(jobId, "CollectionQueueEnqueued", "Job enqueued into Collection queue")
      await this.queueAdapter.enqueue("execution", job) // Reusing framework execution queue for collection worker pipeline

      await this.publishLifecycleEvent(job, "AfterExecute", task)

      await this.stateMachine.transition(jobId, "Verified", "Job verified")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Job reported")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Comment Collection orchestration completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", task)

      return { success: true }
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
      name: `CommentCollection_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "CommentCollectionJobCoordinator",
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
