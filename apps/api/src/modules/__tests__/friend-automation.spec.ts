import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { FriendStateMachine } from "../friend-management/application/services/friend-state-machine.service"
import { FriendJobCoordinator } from "../friend-management/application/services/friend-job-coordinator.service"
import { FriendExecutionStrategy } from "../friend-management/application/services/friend-execution-strategy.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("Friend Request Sent & Accept Auto Flow (F-48 / Client Req #14) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: FriendStateMachine
  let coordinator: FriendJobCoordinator
  let strategy: FriendExecutionStrategy

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new FriendStateMachine()
    coordinator = new FriendJobCoordinator(lockManager, queueAdapter, stateMachine)
    strategy = new FriendExecutionStrategy(queueAdapter)
  })

  it("should verify strategy enqueues, state transitions, locking rules, and HBF constraints", async () => {
    const job: AutomationJob = {
      id: "friend-job-1",
      correlationId: "corr-f-1",
      workspaceId: "ws-1",
      jobType: "friend_request",
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
      dailyLimits: { friend_request: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const runRes = await coordinator.coordinate(job, "acc-1", "friend_request", "user-200", hbfSuccess)
    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("friend-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("friend-job-1")
    expect(timeline.length).toBe(4)
    expect(timeline[0].toState).toBe("Prepared")
    expect(timeline[3].toState).toBe("Completed")
  })
})
