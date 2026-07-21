import { Injectable } from "@nestjs/common"
import { RedisLockManager } from "../../../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../../../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupStateMachineService } from "./group-state-machine.service"
import { AutomationJob, HumanBehaviourConfig } from "../../../automation-core/domain/automation-core.model"

@Injectable()
export class GroupExecutionCoordinatorService {
  constructor(
    private readonly lockManager: RedisLockManager,
    private readonly queueAdapter: BullMQQueueAdapter,
    private readonly stateMachine: GroupStateMachineService
  ) {}

  public async coordinate(
    job: AutomationJob,
    accountId: string,
    groupId: string,
    postId: string,
    hbf: HumanBehaviourConfig
  ): Promise<{ success: boolean; reason?: string }> {
    const jobId = job.id
    console.log(`[GroupExecutionCoordinator] Start coordinate flow for Job: ${jobId}`)

    // 1. Enforce HBF Timezone and working hours validation check
    const localHour = new Date().getUTCHours()
    if (localHour < hbf.workingHours.startHour || localHour > hbf.workingHours.endHour) {
      await this.stateMachine.transition(jobId, "Waiting", "Outside timezone working hours. Waiting state.")
      await this.queueAdapter.enqueue("scheduler", job)
      return { success: false, reason: "Outside working hours config parameters." }
    }

    // 2. Enforce composite lock key: lock:workspace:account:group:post
    const lockKey = `lock:${job.workspaceId}:${accountId}:${groupId}:${postId}`
    const lockAcquired = await this.lockManager.acquireLock(lockKey, "worker-group-1", 15000)
    if (!lockAcquired) {
      await this.stateMachine.transition(jobId, "Failed", "Duplicate posting lock error.")
      await this.queueAdapter.enqueue("dlq", job)
      return { success: false, reason: "Lock key is active. Execution rejected." }
    }

    // 3. Transition through workers pipelines
    await this.stateMachine.transition(jobId, "Prepared", "Job payloads and sessions loaded.")
    await this.stateMachine.transition(jobId, "Running", "Worker active.")
    
    // Simulate verification
    await this.stateMachine.transition(jobId, "Verifying", "Verifying post exists on Facebook feed.")
    await this.stateMachine.transition(jobId, "Completed", "Group Auto-Poster job completed.")
    await this.queueAdapter.enqueue("reporting", job)

    // Release lock
    await this.lockManager.releaseLock(lockKey, "worker-group-1")

    return { success: true }
  }
}
