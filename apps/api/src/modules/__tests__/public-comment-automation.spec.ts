import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { CommentStateMachine } from "../public-comment/application/services/comment-state-machine.service"
import { CommentJobCoordinator } from "../public-comment/application/services/comment-job-coordinator.service"
import { CommentExecutionStrategy } from "../public-comment/application/services/comment-execution-strategy.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("Smart Comment Campaign Engine (F-44 / Client Req #10) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: CommentStateMachine
  let coordinator: CommentJobCoordinator
  let strategy: CommentExecutionStrategy

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new CommentStateMachine()
    coordinator = new CommentJobCoordinator(lockManager, queueAdapter, stateMachine)
    strategy = new CommentExecutionStrategy(queueAdapter)
  })

  it("should verify strategy enqueues, state transitions, locking rules, and HBF constraints", async () => {
    const job: AutomationJob = {
      id: "comment-job-1",
      correlationId: "corr-comm-1",
      workspaceId: "ws-1",
      jobType: "comment_post",
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
      dailyLimits: { comment_post: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const runRes = await coordinator.coordinate(job, "acc-1", "post-2", hbfSuccess)
    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("comment-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("comment-job-1")
    expect(timeline.length).toBe(4)
    expect(timeline[0].toState).toBe("Prepared")
    expect(timeline[3].toState).toBe("Completed")
  })
})
