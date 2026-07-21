import { Injectable, Inject } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { FriendUnfriendStateMachine, UnfriendJobState } from "./friend-unfriend-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"
import { IEventBus } from "../../../automation/application/ports/event-bus.interface"
import { DomainEvent } from "../../../automation/domain/models/domain-event.model"
import * as crypto from "crypto"

@Injectable()
export class FriendUnfriendJobCoordinator extends BaseJobCoordinator<UnfriendJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: FriendUnfriendStateMachine,
    @Inject("IEventBus") private readonly eventBus: IEventBus
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinate(
    job: AutomationJob,
    accountId: string,
    targetUserId: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[FriendUnfriendJobCoordinator] Start coordinate flow for Job: ${jobId}`)

    // 1. Publish JobCreated event
    await this.publishLifecycleEvent(job, "JobCreated", targetUserId)

    // 2. Timezone working hours limits check using Base class
    const hbfValid = await this.validateHbf(job, hbf)
    if (!hbfValid) {
      await this.stateMachine.transition(jobId, "Waiting", "Outside timezone working hours. Waiting state.")
      await this.publishLifecycleEvent(job, "JobScheduled", targetUserId)
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: "Outside working hours config parameters." }
    }

    // 3. Lock key: lock:${workspaceId}:${accountId}:unfriend:${targetUserId}
    const lockKey = `lock:${job.workspaceId}:${accountId}:unfriend:${targetUserId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, "worker-unfriend-1", 10000)
    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", "Duplicate unfriend action lock error.")
      await this.publishLifecycleEvent(job, "JobFailed", targetUserId)
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock key is active. Execution rejected." }
    }

    // 4. Transition steps & publish lifecycle events
    await this.stateMachine.transition(jobId, "Prepared", "User activity and sync logs parsed.")
    await this.publishLifecycleEvent(job, "JobPrepared", targetUserId)

    await this.stateMachine.transition(jobId, "Running", "Worker active.")
    await this.publishLifecycleEvent(job, "JobStarted", targetUserId)

    await this.stateMachine.transition(jobId, "Verifying", "Verifying unfriend action exists on Facebook logs.")
    await this.publishLifecycleEvent(job, "JobVerified", targetUserId)

    await this.stateMachine.transition(jobId, "Completed", "Unfriend Auto-Flow job completed.")
    await this.publishLifecycleEvent(job, "JobCompleted", targetUserId)
    await this.queueAdapter.enqueue("reporting", job)

    // Release lock
    await this.lockManager.releaseLock(lockKey, "worker-unfriend-1")

    return { success: true }
  }

  private async publishLifecycleEvent(job: AutomationJob, eventName: string, entityId: string) {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      name: eventName,
      workspaceId: job.workspaceId,
      payload: {
        entityId,
        jobId: job.id,
        status: job.status
      },
      triggerVersion: "1.0",
      source: "Scheduler",
      correlationId: job.correlationId,
      causationId: job.id,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date()
    }
    await this.eventBus.publish(event)
  }
}
