import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { AutomationMetricsService } from "../automation-core/application/services/automation-metrics.service"
import { AutomationPipelineService } from "../automation-core/application/services/automation-pipeline.service"
import { AutomationJob } from "../automation-core/domain/automation-core.model"
import { AutomationContext, ExecutionResult } from "../automation-core/domain/automation-framework.model"

describe("Automation Framework V2 (F-50 Core Refactor) Unit Tests", () => {
  let queueAdapter: BullMQQueueAdapter
  let lockManager: RedisLockManager
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let delayCalculator: DelayCalculatorService
  let metricsService: AutomationMetricsService
  let pipelineService: AutomationPipelineService

  beforeEach(() => {
    queueAdapter = new BullMQQueueAdapter()
    lockManager = new RedisLockManager()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    delayCalculator = new DelayCalculatorService()
    metricsService = new AutomationMetricsService()
    pipelineService = new AutomationPipelineService(
      queueAdapter,
      lockManager,
      featureFlagService,
      policyService,
      delayCalculator,
      metricsService
    )
  })

  it("should calculate pacing delay using HBF parameters and account health", () => {
    const context: AutomationContext = {
      workspaceId: "ws-test",
      accountId: "acc-test",
      hbfConfig: {
        accountId: "acc-test",
        timezone: "UTC",
        workingHours: { startHour: 0, endHour: 23 },
        dailyLimits: { post: 20 },
        minCooldownMinutes: 10,
        randomDelayRange: { minSeconds: 2, maxSeconds: 5 }
      },
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: 20,
      hourlyBudget: 5,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "scheduler", "execution", "verification", "reporting"]
    }

    const pacing = delayCalculator.calculatePacingDelay(context, 2)
    expect(pacing.isWithinWorkingHours).toBe(true)
    expect(pacing.delayMs).toBeGreaterThanOrEqual(2000)
    expect(pacing.delayMs).toBeLessThanOrEqual(6000)
  })

  it("should record snapshots and summarize metrics cleanly", () => {
    metricsService.recordSnapshot({
      jobId: "job-1",
      queueWaitMs: 100,
      executionDurationMs: 250,
      verificationDurationMs: 30,
      pacingDelayMs: 2000,
      retryCount: 0,
      status: "Success",
      timestamp: new Date()
    })

    metricsService.recordSnapshot({
      jobId: "job-2",
      queueWaitMs: 150,
      executionDurationMs: 450,
      verificationDurationMs: 50,
      pacingDelayMs: 3000,
      retryCount: 1,
      status: "Failed",
      timestamp: new Date()
    })

    const summary = metricsService.getSummaryMetrics()
    expect(summary.totalJobsProcessed).toBe(2)
    expect(summary.averageExecutionDurationMs).toBe(350)
    expect(summary.failureRatePercentage).toBe(50)
    expect(summary.retryRatePercentage).toBe(50)
  })

  it("should execute standard pipeline steps and enqueue to pipeline queues", async () => {
    const job: AutomationJob = {
      id: "pipeline-job-1",
      correlationId: "corr-pipe-1",
      workspaceId: "ws-pipe",
      jobType: "marketplace_post",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const context: AutomationContext = {
      workspaceId: "ws-pipe",
      accountId: "acc-pipe",
      hbfConfig: {
        accountId: "acc-pipe",
        timezone: "UTC",
        workingHours: { startHour: 0, endHour: 23 },
        dailyLimits: { post: 10 },
        minCooldownMinutes: 5,
        randomDelayRange: { minSeconds: 1, maxSeconds: 3 }
      },
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: 10,
      hourlyBudget: 3,
      accountHealthScore: 100,
      riskLevel: "Low",
      queues: ["preparation", "execution", "verification", "reporting"]
    }

    const mockExecutor = async (j: AutomationJob): Promise<ExecutionResult> => {
      return {
        status: "Success",
        durationMs: 120,
        warnings: [],
        retryable: true,
        verificationResult: { status: "Success", verifiedAt: new Date() },
        metrics: { queueWaitMs: 50, executionDurationMs: 120, verificationDurationMs: 20, pacingDelayMs: 1000 },
        auditRef: `audit-${j.id}`,
        logs: ["Executed mock worker successfully"]
      }
    }

    const res = await pipelineService.executePipeline(
      job,
      context,
      "facebook",
      "marketplace_post",
      "item-123",
      mockExecutor
    )

    expect(res.status).toBe("Success")
    expect(res.verificationResult.status).toBe("Success")
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)
  })
})
