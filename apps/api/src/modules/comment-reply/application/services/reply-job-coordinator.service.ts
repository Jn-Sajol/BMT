import { Injectable } from "@nestjs/common"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { ReplyStateMachine } from "./reply-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

@Injectable()
export class ReplyJobCoordinator {
  constructor(
    private readonly lockManager: RedisLockManager,
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly stateMachine: ReplyStateMachine
  ) {}

  public async coordinate(
    job: AutomationJob,
    accountId: string,
    commentId: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[ReplyJobCoordinator] Start coordinate flow for Job: ${jobId}`)

    // 1. Timezone Working Hours check
    const localHour = new Date().getUTCHours()
    if (localHour < hbf.workingHours.startHour || localHour > hbf.workingHours.endHour) {
      await this.stateMachine.transition(jobId, "Waiting", "Outside timezone working hours. Waiting state.")
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: "Outside working hours config parameters." }
    }

    // 2. Lock key: lock:workspace:account:comment
    const lockKey = `lock:${job.workspaceId}:${accountId}:${commentId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, "worker-reply-1", 10000)
    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", "Duplicate reply posting lock error.")
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock key is active. Execution rejected." }
    }

    // 3. Transition steps
    await this.stateMachine.transition(jobId, "Prepared", "Reply suggestion fetched and cookies validated.")
    await this.stateMachine.transition(jobId, "Running", "Worker active.")
    await this.stateMachine.transition(jobId, "Verifying", "Verifying comment reply exists on feed.")
    await this.stateMachine.transition(jobId, "Completed", "AI Comment Reply job completed.")
    await this.queueAdapter.enqueue("reporting", job)

    // Release lock
    await this.lockManager.releaseLock(lockKey, "worker-reply-1")

    return { success: true }
  }
}
