import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { AutomationMetricsService } from "../automation-core/application/services/automation-metrics.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { AutomationPipelineService } from "../automation-core/application/services/automation-pipeline.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob } from "../automation-core/domain/automation-core.model"
import { AutomationContext, ExecutionResult } from "../automation-core/domain/automation-framework.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Automation Plugin & Registry Framework (F-51 Architecture) Unit Tests", () => {
  let queueAdapter: BullMQQueueAdapter
  let lockManager: RedisLockManager
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let delayCalculator: DelayCalculatorService
  let metricsService: AutomationMetricsService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let pipelineService: AutomationPipelineService
  let facebookDriver: FacebookDriver
  let eventBus: InMemoryEventBus

  beforeEach(() => {
    queueAdapter = new BullMQQueueAdapter()
    lockManager = new RedisLockManager()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    delayCalculator = new DelayCalculatorService()
    metricsService = new AutomationMetricsService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    pipelineService = new AutomationPipelineService(
      queueAdapter,
      lockManager,
      featureFlagService,
      policyService,
      delayCalculator,
      metricsService,
      registryService,
      payloadValidator,
      eventBus
    )
    facebookDriver = new FacebookDriver()
    registryService.registerDriver(facebookDriver)
  })

  it("should register platform drivers and automation plugins dynamically", () => {
    const mockPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-marketplace-plugin",
        name: "Facebook Marketplace Plugin",
        version: "1.0.0",
        description: "Automation plugin for FB Marketplace",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.MARKETPLACE_LISTING],
      executionStrategy: { execute: async (j) => ({ success: true }) },
      isEnabled: true,
      verify: async (j) => ({ status: "Success", verifiedAt: new Date() }),
      report: async (j, r) => {}
    }

    registryService.registerPlugin(mockPlugin)
    const resolved = registryService.getPluginByCapability("facebook", AutomationCapability.MARKETPLACE_LISTING)
    expect(resolved).toBeDefined()
    expect(resolved?.metadata.id).toBe("fb-marketplace-plugin")
  })

  it("should validate payloads and feature flags via PayloadValidatorService", async () => {
    const mockPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-groups-plugin",
        name: "Facebook Groups Plugin",
        version: "1.0.0",
        description: "Groups auto poster plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.GROUP_POST],
      executionStrategy: { execute: async (j) => ({ success: true }) },
      isEnabled: true,
      verify: async (j) => ({ status: "Success", verifiedAt: new Date() }),
      report: async (j, r) => {}
    }
    registryService.registerPlugin(mockPlugin)

    const job: AutomationJob = {
      id: "plugin-job-10",
      correlationId: "corr-10",
      workspaceId: "ws-10",
      jobType: "post_group",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const context: AutomationContext = {
      workspaceId: "ws-10",
      accountId: "acc-10",
      hbfConfig: {
        accountId: "acc-10",
        timezone: "UTC",
        workingHours: { startHour: 0, endHour: 23 },
        dailyLimits: { post_group: 10 },
        minCooldownMinutes: 5,
        randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
      },
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: 10,
      hourlyBudget: 3,
      accountHealthScore: 90,
      riskLevel: "Low",
      queues: ["preparation", "execution", "verification", "reporting"]
    }

    const validation = await payloadValidator.validateJobPayload(job, context, "facebook", AutomationCapability.GROUP_POST)
    expect(validation.valid).toBe(true)
  })

  it("should execute pipeline invoking lifecycle hooks and attaching eventVersion 1.0 to framework events", async () => {
    const hookTracker: string[] = []

    const mockPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-comments-plugin",
        name: "Facebook Comments Plugin",
        version: "1.0.0",
        description: "Auto comments plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT],
      executionStrategy: { execute: async (j) => ({ success: true }) },
      isEnabled: true,
      verify: async (j) => ({ status: "Success", verifiedAt: new Date() }),
      report: async (j, r) => {},
      hooks: {
        BeforePrepare: [async () => { hookTracker.push("BeforePrepare") }],
        BeforeExecute: [async () => { hookTracker.push("BeforeExecute") }],
        AfterExecute: [async () => { hookTracker.push("AfterExecute") }],
        AfterComplete: [async () => { hookTracker.push("AfterComplete") }]
      }
    }
    registryService.registerPlugin(mockPlugin)

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (event) => {
      publishedEvents.push(event)
    })

    const job: AutomationJob = {
      id: "plugin-job-20",
      correlationId: "corr-20",
      workspaceId: "ws-20",
      jobType: "comment_post",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const context: AutomationContext = {
      workspaceId: "ws-20",
      accountId: "acc-20",
      hbfConfig: {
        accountId: "acc-20",
        timezone: "UTC",
        workingHours: { startHour: 0, endHour: 23 },
        dailyLimits: { comment_post: 10 },
        minCooldownMinutes: 5,
        randomDelayRange: { minSeconds: 1, maxSeconds: 3 }
      },
      featureFlags: { "system.advanced_automation": true },
      dailyBudget: 10,
      hourlyBudget: 3,
      accountHealthScore: 95,
      riskLevel: "Low",
      queues: ["preparation", "execution", "verification", "reporting"]
    }

    const mockExecutor = async (j: AutomationJob): Promise<ExecutionResult> => ({
      status: "Success",
      durationMs: 100,
      warnings: [],
      retryable: true,
      verificationResult: { status: "Success", verifiedAt: new Date() },
      metrics: { queueWaitMs: 20, executionDurationMs: 100, verificationDurationMs: 15, pacingDelayMs: 500 },
      auditRef: "audit-20",
      logs: ["Executed plugin successfully"]
    })

    const res = await pipelineService.executePipeline(
      job,
      context,
      "facebook",
      "comment_post",
      "post-99",
      mockExecutor,
      AutomationCapability.COMMENT
    )

    expect(res.status).toBe("Success")
    expect(hookTracker).toEqual(["BeforePrepare", "BeforeExecute", "AfterExecute", "AfterComplete"])
    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
