import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentBlockStateMachine, CommentBlockJobState } from "./comment-block-state-machine.service"
import { CommentTargetParserService, NormalizedTargetPayload } from "./comment-target-parser.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

@Injectable()
export class CommentBlockJobCoordinator extends BaseJobCoordinator<CommentBlockJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: CommentBlockStateMachine,
    private readonly parserService: CommentTargetParserService,
    private readonly delayCalculator: DelayCalculatorService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateBlockScraper(
    job: AutomationJob,
    accountId: string,
    targetId: string,
    rawUrl: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; payload?: NormalizedTargetPayload; reason?: string }> {
    const jobId = job.id
    console.log(`[CommentBlockCoordinator] Registering target ${targetId} (${rawUrl}) for Job ${jobId}`)

    await this.publishLifecycleEvent(job, "BeforePrepare", { targetId, rawUrl })

    // 1. Target Registration & Parsing Payload Generation
    const existingTargetIds = new Set<string>()
    const parsedPayload = this.parserService.prepareParserPayload(targetId, rawUrl, existingTargetIds)
    await this.stateMachine.transition(jobId, "TargetRegistered", `Target ${targetId} registered (${parsedPayload.classification})`)

    // 2. HBF Validation & Pacing via DelayCalculatorService
    const pacing = this.delayCalculator.calculatePacingDelay({
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.comment_block_discovery || 30,
      hourlyBudget: 10,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "parsing", "verification", "reporting"]
    })

    if (!pacing.isWithinWorkingHours) {
      await this.stateMachine.transition(jobId, "Failed", `Outside working hours: ${pacing.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: pacing.reason })
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: pacing.reason }
    }

    await this.stateMachine.transition(jobId, "HbfCalculated", `Pacing delay calculated: ${pacing.delayMs}ms`)

    // 3. Distributed Lock with required format: lock:${workspaceId}:${accountId}:comment_block:${targetId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:comment_block:${targetId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", parsedPayload)

      // 4. Pipeline Queue Routing (Scheduler Queue -> Parsing Queue -> Verification Queue -> Reporting)
      await this.stateMachine.transition(jobId, "Scheduled", "Job enqueued into Scheduler queue")
      await this.queueAdapter.enqueue("scheduler", job)

      await this.stateMachine.transition(jobId, "ParsingQueueEnqueued", "Job enqueued into Parsing queue")
      await this.queueAdapter.enqueue("execution", job) // Reusing framework execution queue for parsing worker pipeline

      await this.publishLifecycleEvent(job, "AfterExecute", parsedPayload)

      await this.stateMachine.transition(jobId, "Verified", "Job verified")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Job reported")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Comment Block Scraper foundation completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", parsedPayload)

      return { success: true, payload: parsedPayload }
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
      name: `CommentBlock_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "CommentBlockJobCoordinator",
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
