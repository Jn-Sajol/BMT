import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupMessengerStateMachine } from "../messenger-groups/application/services/group-messenger-state-machine.service"
import { GroupMessengerJobCoordinator } from "../messenger-groups/application/services/group-messenger-job-coordinator.service"
import { GroupMessengerExecutionStrategy } from "../messenger-groups/application/services/group-messenger-execution-strategy.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("AI Messenger Group Assistant ADVANCED (F-47 / Client Req #13) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: GroupMessengerStateMachine
  let coordinator: GroupMessengerJobCoordinator
  let strategy: GroupMessengerExecutionStrategy

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new GroupMessengerStateMachine()
    coordinator = new GroupMessengerJobCoordinator(lockManager, queueAdapter, stateMachine)
    strategy = new GroupMessengerExecutionStrategy(queueAdapter)
  })

  it("should verify strategy enqueues, state transitions, locking rules, and HBF constraints", async () => {
    const job: AutomationJob = {
      id: "grp-mess-job-1",
      correlationId: "corr-g-mess-1",
      workspaceId: "ws-1",
      jobType: "group_messenger_post",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 1. Validate Strategy
    const res = await strategy.execute(job)
    expect(res.success).toBe(true)
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)

    // 2. Validate Coordinator success under valid HBF config
    const hbfSuccess: HumanBehaviourConfig = {
      accountId: "acc-1",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { group_messenger_post: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const runRes = await coordinator.coordinate(job, "acc-1", "thread-20", hbfSuccess)
    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("grp-mess-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("grp-mess-job-1")
    expect(timeline.length).toBe(4)
    expect(timeline[0].toState).toBe("Prepared")
    expect(timeline[3].toState).toBe("Completed")
  })
})
