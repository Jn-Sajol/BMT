import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupAutoJoinStateMachine, GroupAutoJoinJobState } from "./group-autojoin-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { DelayCalculatorService } from "../../../automation-core/application/services/delay-calculator.service"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

export interface CandidateJoinTask {
  groupId: string
  groupName: string
  priorityScore: number
}

@Injectable()
export class GroupAutoJoinJobCoordinator extends BaseJobCoordinator<GroupAutoJoinJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: GroupAutoJoinStateMachine,
    private readonly delayCalculator: DelayCalculatorService,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinateAutoJoin(
    job: AutomationJob,
    accountId: string,
    candidate: CandidateJoinTask,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[GroupAutoJoinCoordinator] Consuming candidate ${candidate.groupId} (${candidate.groupName}) for Job ${jobId}`)

    await this.publishLifecycleEvent(job, "BeforePrepare", candidate)
    await this.stateMachine.transition(jobId, "CandidateConsumed", `Consumed candidate ${candidate.groupId}`)

    // 1. HBF Validation & Pacing via DelayCalculatorService
    const pacing = this.delayCalculator.calculatePacingDelay({
      workspaceId: job.workspaceId,
      accountId,
      hbfConfig: hbf,
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: hbf.dailyLimits?.group_autojoin || 20,
      hourlyBudget: 5,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    })

    if (!pacing.isWithinWorkingHours) {
      await this.stateMachine.transition(jobId, "Failed", `Outside working hours: ${pacing.reason}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: pacing.reason })
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: pacing.reason }
    }

    await this.stateMachine.transition(jobId, "HbfCalculated", `Pacing delay calculated: ${pacing.delayMs}ms`)

    // 2. Distributed Locking with required format: lock:${workspaceId}:${accountId}:group_join:${groupId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:group_join:${candidate.groupId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, `worker-${jobId}`, 15000)

    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", `Distributed lock conflict for ${lockKey}`)
      await this.publishLifecycleEvent(job, "OnFailure", { reason: "Lock Conflict" })
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock Conflict" }
    }

    try {
      await this.publishLifecycleEvent(job, "BeforeExecute", candidate)

      // 3. Pipeline Queue Routing (Scheduler -> Execution -> Verification -> Reporting)
      await this.stateMachine.transition(jobId, "Scheduled", "Job enqueued into Scheduler queue")
      await this.queueAdapter.enqueue("scheduler", job)

      await this.stateMachine.transition(jobId, "Executing", "Job enqueued into Execution queue")
      await this.queueAdapter.enqueue("execution", job)

      await this.publishLifecycleEvent(job, "AfterExecute", candidate)

      await this.stateMachine.transition(jobId, "Verified", "Job verified")
      await this.queueAdapter.enqueue("verification", job)

      await this.stateMachine.transition(jobId, "Reported", "Job reported")
      await this.queueAdapter.enqueue("reporting", job)

      await this.stateMachine.transition(jobId, "Completed", "Group Auto Join orchestration completed successfully")
      await this.publishLifecycleEvent(job, "AfterComplete", candidate)

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
      name: `GroupAutoJoin_${stageName}`,
      workspaceId: job.workspaceId,
      payload: {
        entityId: job.id,
        jobId: job.id,
        status: job.status,
        ...details
      },
      triggerVersion: "1.0",
      eventVersion: "1.0", // Mandatory Event Versioning
      source: "GroupAutoJoinJobCoordinator",
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
