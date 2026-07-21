import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { ExecutionEngineService } from "../automation-core/application/services/execution-engine.service"
import { SchedulerService } from "../automation-core/application/services/scheduler.service"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"

describe("Automation Core Foundation (F-37) Unit Tests", () => {
  let queueAdapter: BullMQQueueAdapter
  let lockManager: RedisLockManager
  let featureFlags: FeatureFlagService
  let policyService: PolicyService
  let executionEngine: ExecutionEngineService
  let scheduler: SchedulerService

  beforeEach(() => {
    queueAdapter = new BullMQQueueAdapter()
    lockManager = new RedisLockManager()
    featureFlags = new FeatureFlagService()
    policyService = new PolicyService()
    executionEngine = new ExecutionEngineService(queueAdapter, lockManager, featureFlags, policyService)
    scheduler = new SchedulerService(queueAdapter)
  })

  it("should acquire and release distributed locks securely, preventing duplicate execution", async () => {
    const key = "lock:post:101"
    const firstAcquire = await lockManager.acquireLock(key, "worker-a", 5000)
    expect(firstAcquire).toBe(true)

    const secondAcquire = await lockManager.acquireLock(key, "worker-b", 5000)
    expect(secondAcquire).toBe(false) // already locked

    const releaseByNonOwner = await lockManager.releaseLock(key, "worker-b")
    expect(releaseByNonOwner).toBe(false) // cannot release other worker's lock

    const releaseByOwner = await lockManager.releaseLock(key, "worker-a")
    expect(releaseByOwner).toBe(true)
  })

  it("should schedule jobs within working hours config parameters and delay night actions", async () => {
    const job: AutomationJob = {
      id: "job-101",
      correlationId: "corr-101",
      workspaceId: "ws-1",
      jobType: "post_group",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbfWorking: HumanBehaviourConfig = {
      accountId: "acc-1",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 }, // wide working hours
      dailyLimits: { post_group: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const isScheduledNow = await scheduler.scheduleJob(job, hbfWorking)
    expect(isScheduledNow).toBe(true)
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)

    // Schedule with night hours mapping
    const hbfNight: HumanBehaviourConfig = {
      accountId: "acc-1",
      timezone: "UTC",
      workingHours: { startHour: 2, endHour: 3 }, // Narrow night hours (mostly closed)
      dailyLimits: { post_group: 10 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const job2 = { ...job, id: "job-102", status: "Created" as const }
    // If the current hour is outside 2-3, it should postpone
    const currentHour = new Date().getUTCHours()
    const shouldPostpone = currentHour < 2 || currentHour > 3

    const isScheduledNow2 = await scheduler.scheduleJob(job2, hbfNight)
    expect(isScheduledNow2).toBe(!shouldPostpone)
    if (shouldPostpone) {
      expect(job2.status).toBe("Waiting")
      expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    }
  })

  it("should process enqueued actions after policy validations and reject low account health scores to DLQ", async () => {
    const job: AutomationJob = {
      id: "job-201",
      correlationId: "corr-201",
      workspaceId: "ws-1",
      jobType: "post_group",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 1. Process with high health score (valid)
    const resultSuccess = await executionEngine.processJob(job, "facebook", "post_group", 85)
    expect(resultSuccess.success).toBe(true)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)

    // 2. Process with low health score (invalid)
    const job2 = { ...job, id: "job-202" }
    const resultFailure = await executionEngine.processJob(job2, "facebook", "post_group", 25)
    expect(resultFailure.success).toBe(false)
    expect(resultFailure.error).toContain("health score")
    expect(await queueAdapter.getQueueSize("dlq")).toBe(1)
  })
})
