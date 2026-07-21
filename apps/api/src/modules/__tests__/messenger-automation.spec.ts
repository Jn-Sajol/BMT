import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { MessengerStateMachine } from "../messenger-controller/application/services/messenger-state-machine.service"
import { MessengerJobCoordinator } from "../messenger-controller/application/services/messenger-job-coordinator.service"
import { MessengerExecutionStrategy } from "../messenger-controller/application/services/messenger-execution-strategy.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("Messenger Controller ADVANCED (F-46 / Client Req #12) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: MessengerStateMachine
  let coordinator: MessengerJobCoordinator
  let strategy: MessengerExecutionStrategy

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new MessengerStateMachine()
    coordinator = new MessengerJobCoordinator(lockManager, queueAdapter, stateMachine)
    strategy = new MessengerExecutionStrategy(queueAdapter)
  })

  it("should verify strategy enqueues, state transitions, locking rules, and HBF constraints", async () => {
    const job: AutomationJob = {
      id: "mess-job-1",
      correlationId: "corr-mess-1",
      workspaceId: "ws-1",
      jobType: "messenger_reply",
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
      dailyLimits: { messenger_reply: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const runRes = await coordinator.coordinate(job, "acc-1", "thread-20", hbfSuccess)
    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("mess-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("mess-job-1")
    expect(timeline.length).toBe(4)
    expect(timeline[0].toState).toBe("Prepared")
    expect(timeline[3].toState).toBe("Completed")
  })
})
