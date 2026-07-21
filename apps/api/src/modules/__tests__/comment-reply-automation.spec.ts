import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { ReplyStateMachine } from "../comment-reply/application/services/reply-state-machine.service"
import { ReplyJobCoordinator } from "../comment-reply/application/services/reply-job-coordinator.service"
import { ReplyExecutionStrategy } from "../comment-reply/application/services/reply-execution-strategy.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("AI Reply Comment Assistant (F-45 / Client Req #11) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: ReplyStateMachine
  let coordinator: ReplyJobCoordinator
  let strategy: ReplyExecutionStrategy

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new ReplyStateMachine()
    coordinator = new ReplyJobCoordinator(lockManager, queueAdapter, stateMachine)
    strategy = new ReplyExecutionStrategy(queueAdapter)
  })

  it("should verify strategy enqueues, state transitions, locking rules, and HBF constraints", async () => {
    const job: AutomationJob = {
      id: "reply-job-1",
      correlationId: "corr-repl-1",
      workspaceId: "ws-1",
      jobType: "comment_reply",
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
      dailyLimits: { comment_reply: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const runRes = await coordinator.coordinate(job, "acc-1", "comment-20", hbfSuccess)
    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("reply-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("reply-job-1")
    expect(timeline.length).toBe(4)
    expect(timeline[0].toState).toBe("Prepared")
    expect(timeline[3].toState).toBe("Completed")
  })
})
