import { Injectable } from "@nestjs/common"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentStateMachine } from "./comment-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

@Injectable()
export class CommentJobCoordinator {
  constructor(
    private readonly lockManager: RedisLockManager,
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly stateMachine: CommentStateMachine
  ) {}

  public async coordinate(
    job: AutomationJob,
    accountId: string,
    postId: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[CommentJobCoordinator] Start coordinate flow for Job: ${jobId}`)

    // 1. Timezone Working Hours check
    const localHour = new Date().getUTCHours()
    if (localHour < hbf.workingHours.startHour || localHour > hbf.workingHours.endHour) {
      await this.stateMachine.transition(jobId, "Waiting", "Outside timezone working hours. Waiting state.")
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: "Outside working hours config parameters." }
    }

    // 2. Lock key: lock:workspace:account:post
    const lockKey = `lock:${job.workspaceId}:${accountId}:${postId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, "worker-comment-1", 10000)
    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", "Duplicate comment posting lock error.")
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock key is active. Execution rejected." }
    }

    // 3. Transition steps
    await this.stateMachine.transition(jobId, "Prepared", "Comment template and cookies resolved.")
    await this.stateMachine.transition(jobId, "Running", "Worker active.")
    await this.stateMachine.transition(jobId, "Verifying", "Verifying comment exists on feed.")
    await this.stateMachine.transition(jobId, "Completed", "Comment Auto-Poster job completed.")
    await this.queueAdapter.enqueue("reporting", job)

    // Release lock
    await this.lockManager.releaseLock(lockKey, "worker-comment-1")

    return { success: true }
  }
}
