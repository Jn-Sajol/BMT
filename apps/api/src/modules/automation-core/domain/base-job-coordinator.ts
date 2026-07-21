import { RedisLockManager } from "../infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../infrastructure/bullmq-queue.adapter"
import { BaseStateMachine } from "./base-state-machine"
import { AutomationJob, HumanBehaviourConfig } from "./automation-core.model"

export abstract class BaseJobCoordinator<TState extends string> {
  constructor(
    protected readonly lockManager: RedisLockManager,
    protected readonly queueAdapter: BullMQQueueAdapter,
    protected readonly stateMachine: BaseStateMachine<TState>
  ) {}

  protected async validateHbf(job: AutomationJob, hbf: HumanBehaviourConfig): Promise<boolean> {
    const localHour = new Date().getUTCHours()
    if (localHour < hbf.workingHours.startHour || localHour > hbf.workingHours.endHour) {
      return false
    }
    return true
  }

  protected getLockKey(workspaceId: string, accountId: string, action: string, targetId: string): string {
    return `lock:${workspaceId}:${accountId}:${action}:${targetId}`
  }
}
