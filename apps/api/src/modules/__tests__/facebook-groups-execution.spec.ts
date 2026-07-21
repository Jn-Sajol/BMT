import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupStateMachineService } from "../facebook-groups/application/services/group-state-machine.service"
import { GroupExecutionCoordinatorService } from "../facebook-groups/application/services/group-execution-coordinator.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("Facebook Group Auto Poster Execution (F-43 / Client Req #9) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: GroupStateMachineService
  let coordinator: GroupExecutionCoordinatorService

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new GroupStateMachineService()
    coordinator = new GroupExecutionCoordinatorService(lockManager, queueAdapter, stateMachine)
  })

  it("should enforce HBF hours pacing and composite locks, and transition pipeline statuses", async () => {
    const job: AutomationJob = {
      id: "group-exec-101",
      correlationId: "corr-g-101",
      workspaceId: "ws-100",
      jobType: "group_post",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 1. Timezone Check Failure (HBF Night Config)
    const hbfNight: HumanBehaviourConfig = {
      accountId: "acc-10",
      timezone: "UTC",
      workingHours: { startHour: 2, endHour: 3 }, // Narrow working hours
      dailyLimits: { group_post: 10 },
      minCooldownMinutes: 10,
      randomDelayRange: { minSeconds: 5, maxSeconds: 15 }
    }

    // If the current hour is outside 2-3, it will trigger the scheduler queue delay
    const currentHour = new Date().getUTCHours()
    const isNight = currentHour < 2 || currentHour > 3

    const resNight = await coordinator.coordinate(job, "acc-10", "grp-1", "post-9", hbfNight)
    if (isNight) {
      expect(resNight.success).toBe(false)
      expect(resNight.reason).toContain("Outside working hours")
      expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
      expect(stateMachine.getJobState("group-exec-101")).toBe("Waiting")
    }

    // 2. Clear queues & run with valid working hours (HBF Wide Config)
    const queueAdapter2 = new BullMQQueueAdapter()
    const stateMachine2 = new GroupStateMachineService()
    const coordinator2 = new GroupExecutionCoordinatorService(lockManager, queueAdapter2, stateMachine2)

    const job2 = { ...job, id: "group-exec-102" }
    const hbfWide: HumanBehaviourConfig = {
      accountId: "acc-10",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 }, // Wide hours
      dailyLimits: { group_post: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const resSuccess = await coordinator2.coordinate(job2, "acc-10", "grp-1", "post-9", hbfWide)
    expect(resSuccess.success).toBe(true)
    expect(stateMachine2.getJobState("group-exec-102")).toBe("Completed")

    // Assert composite lock prevented concurrent posting
    const job3 = { ...job, id: "group-exec-103" }
    // Lock key: lock:ws-100:acc-10:grp-1:post-9 is already held by job2's flow if lock wasn't released.
    // In coordinate flow, lock is released at the end, so let's check lock block by manually holding lock.
    const lockKey = `lock:ws-100:acc-10:grp-1:post-9`
    await lockManager.acquireLock(lockKey, "external-holder", 10000)

    const resLocked = await coordinator2.coordinate(job3, "acc-10", "grp-1", "post-9", hbfWide)
    expect(resLocked.success).toBe(false)
    expect(resLocked.reason).toContain("Lock key is active")
  })
})
