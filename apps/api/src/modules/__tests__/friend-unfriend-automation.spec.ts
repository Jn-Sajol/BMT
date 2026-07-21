import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { FriendUnfriendStateMachine } from "../friend-management/application/services/friend-unfriend-state-machine.service"
import { FriendUnfriendJobCoordinator } from "../friend-management/application/services/friend-unfriend-job-coordinator.service"
import { FriendUnfriendExecutionStrategy } from "../friend-management/application/services/friend-unfriend-execution-strategy.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Unfriend Inactive User ADVANCED (F-49 / Client Req #15) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: FriendUnfriendStateMachine
  let coordinator: FriendUnfriendJobCoordinator
  let strategy: FriendUnfriendExecutionStrategy
  let eventBus: InMemoryEventBus

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new FriendUnfriendStateMachine()
    eventBus = new InMemoryEventBus()
    coordinator = new FriendUnfriendJobCoordinator(lockManager, queueAdapter, stateMachine, eventBus)
    strategy = new FriendUnfriendExecutionStrategy(queueAdapter)
  })

  it("should verify strategy enqueues, state transitions, locking rules, and HBF constraints", async () => {
    const job: AutomationJob = {
      id: "unf-job-1",
      correlationId: "corr-unf-1",
      workspaceId: "ws-1",
      jobType: "unfriend",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Subscribe to EventBus to track lifecycle event publishing
    const publishedEvents: string[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e.name)
    })

    // 1. Validate Strategy
    const res = await strategy.execute(job)
    expect(res.success).toBe(true)
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)

    // 2. Validate Coordinator success under valid HBF config
    const hbfSuccess: HumanBehaviourConfig = {
      accountId: "acc-1",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { unfriend: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const runRes = await coordinator.coordinate(job, "acc-1", "user-inactive-99", hbfSuccess)
    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("unf-job-1")).toBe("Completed")

    // Assert that lifecycle events were published through EventBus
    expect(publishedEvents).toContain("JobCreated")
    expect(publishedEvents).toContain("JobPrepared")
    expect(publishedEvents).toContain("JobStarted")
    expect(publishedEvents).toContain("JobVerified")
    expect(publishedEvents).toContain("JobCompleted")
  })
})
