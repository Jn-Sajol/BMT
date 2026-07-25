import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { MessengerGroupPolicyService, MessengerGroupPolicyConfig } from "../messenger-group/application/services/messenger-group-policy.service"
import { GroupMessageTemplateService } from "../messenger-group/application/services/group-message-template.service"
import { GroupMessageVariationService } from "../messenger-group/application/services/group-message-variation.service"
import { MessengerGroupDelayService } from "../messenger-group/application/services/messenger-group-delay.service"
import { MessengerGroupVerificationService } from "../messenger-group/application/services/messenger-group-verification.service"
import { MessengerGroupMessagingStateMachine } from "../messenger-group/application/services/messenger-group-messaging-state-machine.service"
import { MessengerGroupMessagingJobCoordinator, MessengerGroupMessagingTask } from "../messenger-group/application/services/messenger-group-messaging-job-coordinator.service"
import { MessengerGroupMessagingExecutionStrategy } from "../messenger-group/application/services/messenger-group-messaging-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Messenger Group Assistant Messaging Engine (F-64 / Client Requirement 13 Completion) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: MessengerGroupMessagingStateMachine
  let policyService: PolicyService
  let groupPolicyService: MessengerGroupPolicyService
  let templateService: GroupMessageTemplateService
  let variationService: GroupMessageVariationService
  let delayCalculator: DelayCalculatorService
  let delayService: MessengerGroupDelayService
  let verificationService: MessengerGroupVerificationService
  let featureFlagService: FeatureFlagService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: MessengerGroupMessagingJobCoordinator
  let strategy: MessengerGroupMessagingExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new MessengerGroupMessagingStateMachine()
    policyService = new PolicyService()
    groupPolicyService = new MessengerGroupPolicyService(policyService)
    templateService = new GroupMessageTemplateService()
    variationService = new GroupMessageVariationService()
    delayCalculator = new DelayCalculatorService()
    delayService = new MessengerGroupDelayService(delayCalculator)
    verificationService = new MessengerGroupVerificationService()
    featureFlagService = new FeatureFlagService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new MessengerGroupMessagingJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      groupPolicyService,
      templateService,
      variationService,
      delayService,
      verificationService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new MessengerGroupMessagingExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-message-engine-plugin",
        name: "Facebook Messenger Group Message Engine",
        version: "1.0.0",
        description: "Messenger Group Message Engine plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_GROUP_MESSAGE_ENGINE],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under MESSENGER_GROUP_MESSAGE_ENGINE capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.MESSENGER_GROUP_MESSAGE_ENGINE)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-group-message-engine-plugin")
  })

  it("should enforce group policy rules (daily limits, cooldown, duplicate prevention, blocked groups)", async () => {
    const hbf: HumanBehaviourConfig = {
      accountId: "acc-gmsg-policy",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 24 },
      dailyLimits: { messenger_group_message_engine: 100 },
      minCooldownMinutes: 10,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    const config: MessengerGroupPolicyConfig = {
      isCampaignEnabled: true,
      workingHours: { startHour: 0, endHour: 24 },
      maxDailyMessagesPerAccount: 5,
      maxDailyMessagesPerGroup: 2,
      cooldownMinutesPerGroup: 10,
      blockedGroupIds: ["blocked-grp-1"]
    }

    // Blocked check
    const check1 = await groupPolicyService.isMessagingAllowed("blocked-grp-1", "acc-gmsg-policy", "Hello", hbf, config)
    expect(check1.allowed).toBe(false)
    expect(check1.reason).toContain("blocked list")

    // Normal check
    const check2 = await groupPolicyService.isMessagingAllowed("grp-ok-1", "acc-gmsg-policy", "Hello everyone!", hbf, config)
    expect(check2.allowed).toBe(true)

    // Cooldown check & Duplicate check
    groupPolicyService.recordSentMessage("grp-ok-1", "acc-gmsg-policy", "Hello everyone!")
    const check3 = await groupPolicyService.isMessagingAllowed("grp-ok-1", "acc-gmsg-policy", "Hello everyone!", hbf, config)
    expect(check3.allowed).toBe(false)
    expect(check3.reason).toContain("cooldown active")
  })

  it("should select template, rotate usage, and generate safe message variation", () => {
    const t1 = templateService.selectTemplateForCampaign("SALES")
    expect(t1).toBeDefined()
    expect(t1.useCount).toBe(1)

    const variation = variationService.generateVariation(t1.content)
    expect(variation.length).toBeGreaterThan(0)
  })

  it("should calculate delay and verify messaging status", () => {
    const context = {
      workspaceId: "ws-gmsg",
      accountId: "acc-gmsg",
      hbfConfig: {
        workingHours: { startHour: 0, endHour: 24 },
        randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
      } as any,
      featureFlags: {},
      dailyBudget: 100,
      hourlyBudget: 10,
      accountHealthScore: 90,
      riskLevel: "Low" as const,
      queues: ["execution"]
    }

    const { delaySeconds } = delayService.calculateGroupDelay(context)
    expect(delaySeconds).toBeGreaterThanOrEqual(30)
    expect(delaySeconds).toBeLessThanOrEqual(180)

    const vRecord = verificationService.verifyGroupMessage("camp-1", "grp-1", "SENT")
    expect(vRecord.status).toBe("SENT")
    expect(vRecord.isRetryEligible).toBe(false)

    const vFail = verificationService.verifyGroupMessage("camp-2", "grp-2", "FAILED", "Network timeout")
    expect(vFail.isRetryEligible).toBe(true)
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:group_message:${campaignId}, route through group messaging pipeline, and publish framework events with eventVersion 1.0", async () => {
    const job: AutomationJob = {
      id: "group-msg-job-1",
      correlationId: "corr-gmsg-1",
      workspaceId: "ws-gmsg-test",
      jobType: "messenger_group_message_engine",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-gmsg-test",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 24 },
      dailyLimits: { messenger_group_message_engine: 150 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    const task: MessengerGroupMessagingTask = {
      campaignId: "gcamp-777",
      groupId: "grp-999",
      category: "SALES",
      policyConfig: {
        isCampaignEnabled: true,
        workingHours: { startHour: 0, endHour: 24 },
        maxDailyMessagesPerAccount: 100,
        maxDailyMessagesPerGroup: 10,
        cooldownMinutesPerGroup: 0,
        blockedGroupIds: []
      }
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateMessagingEngine(job, "acc-gmsg-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.selectedTemplate).toBeDefined()
    expect(runRes.variedMessage).toBeDefined()
    expect(runRes.verificationRecord?.status).toBe("SENT")
    expect(stateMachine.getJobState("group-msg-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("group-msg-job-1")
    expect(timeline.length).toBe(9)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
