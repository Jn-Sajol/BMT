import { Injectable } from "@nestjs/common"
import { BaseJobCoordinator } from "../../../automation-core/domain/base-job-coordinator"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { FriendStateMachine, FriendJobState } from "./friend-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

@Injectable()
export class FriendJobCoordinator extends BaseJobCoordinator<FriendJobState> {
  constructor(
    lockManager: RedisLockManager,
    queueAdapter: BullMQQueueAdapter,
    stateMachine: FriendStateMachine
  ) {
    super(lockManager, queueAdapter, stateMachine)
  }

  public async coordinate(
    job: AutomationJob,
    accountId: string,
    action: string,
    targetUserId: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[FriendJobCoordinator] Start coordinate flow for Job: ${jobId}`)

    // 1. Timezone working hours limits check using Base class
    const hbfValid = await this.validateHbf(job, hbf)
    if (!hbfValid) {
      await this.stateMachine.transition(jobId, "Waiting", "Outside timezone working hours. Waiting state.")
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: "Outside working hours config parameters." }
    }

    // 2. Lock key using Base class: lock:${workspaceId}:${accountId}:${action}:${targetUserId}
    const lockKey = this.getLockKey(job.workspaceId, accountId, action, targetUserId)
    const lockAcquired = await this.lockManager.acquireLock(lockKey, "worker-friend-1", 10000)
    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", "Duplicate action lock error.")
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock key is active. Execution rejected." }
    }

    // 3. Transition steps
    await this.stateMachine.transition(jobId, "Prepared", "Friend suggestions target list resolved.")
    await this.stateMachine.transition(jobId, "Running", "Worker active.")
    await this.stateMachine.transition(jobId, "Verifying", "Verifying request sent exists on Facebook.")
    await this.stateMachine.transition(jobId, "Completed", "Friend Auto-Requester job completed.")
    await this.queueAdapter.enqueue("reporting", job)

    // Release lock
    await this.lockManager.releaseLock(lockKey, "worker-friend-1")

    return { success: true }
  }
}
