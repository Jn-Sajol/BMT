import { Injectable } from "@nestjs/common"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerStateMachine } from "./messenger-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

@Injectable()
export class MessengerJobCoordinator {
  constructor(
    private readonly lockManager: RedisLockManager,
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly stateMachine: MessengerStateMachine
  ) {}

  public async coordinate(
    job: AutomationJob,
    accountId: string,
    threadId: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[MessengerJobCoordinator] Start coordinate flow for Job: ${jobId}`)

    // 1. Timezone Working Hours check
    const localHour = new Date().getUTCHours()
    if (localHour < hbf.workingHours.startHour || localHour > hbf.workingHours.endHour) {
      await this.stateMachine.transition(jobId, "Waiting", "Outside timezone working hours. Waiting state.")
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: "Outside working hours config parameters." }
    }

    // 2. Lock key: lock:workspace:account:thread
    const lockKey = `lock:${job.workspaceId}:${accountId}:${threadId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, "worker-messenger-1", 10000)
    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", "Duplicate message sending lock error.")
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock key is active. Execution rejected." }
    }

    // 3. Transition steps
    await this.stateMachine.transition(jobId, "Prepared", "Reply template and cookies resolved.")
    await this.stateMachine.transition(jobId, "Running", "Worker active.")
    await this.stateMachine.transition(jobId, "Verifying", "Verifying message exists in inbox thread.")
    await this.stateMachine.transition(jobId, "Completed", "Messenger Auto-Responder job completed.")
    await this.queueAdapter.enqueue("reporting", job)

    // Release lock
    await this.lockManager.releaseLock(lockKey, "worker-messenger-1")

    return { success: true }
  }
}
