import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { MessengerGroupDiscoveryService } from "../messenger-group/application/services/messenger-group-discovery.service"
import { MessengerGroupClassificationService } from "../messenger-group/application/services/messenger-group-classification.service"
import { MessengerGroupCampaignPreparationService } from "../messenger-group/application/services/messenger-group-campaign-preparation.service"
import { MessengerGroupStateMachine } from "../messenger-group/application/services/messenger-group-state-machine.service"
import { MessengerGroupJobCoordinator, MessengerGroupTask } from "../messenger-group/application/services/messenger-group-job-coordinator.service"
import { MessengerGroupExecutionStrategy } from "../messenger-group/application/services/messenger-group-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Messenger Group Assistant Foundation (F-63 / Client Requirement 13) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: MessengerGroupStateMachine
  let discoveryService: MessengerGroupDiscoveryService
  let classificationService: MessengerGroupClassificationService
  let campaignPrepService: MessengerGroupCampaignPreparationService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: MessengerGroupJobCoordinator
  let strategy: MessengerGroupExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new MessengerGroupStateMachine()
    discoveryService = new MessengerGroupDiscoveryService()
    classificationService = new MessengerGroupClassificationService()
    campaignPrepService = new MessengerGroupCampaignPreparationService()
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new MessengerGroupJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      discoveryService,
      classificationService,
      campaignPrepService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new MessengerGroupExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-group-plugin",
        name: "Facebook Messenger Group Assistant Foundation",
        version: "1.0.0",
        description: "Messenger Group Assistant plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_GROUP_ASSISTANT],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under MESSENGER_GROUP_ASSISTANT capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.MESSENGER_GROUP_ASSISTANT)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-messenger-group-plugin")
  })

  it("should normalize group metadata and deduplicate event IDs", () => {
    const payload1 = {
      eventId: "evt-g-100",
      groupId: "grp-100",
      groupName: "Dhaka Buy and Sell Market",
      participantCount: 25,
      lastMessage: "Dam koto bhai?",
      workspaceId: "ws-mg",
      accountId: "acc-mg"
    }

    // 1. Initial normalization
    const res1 = discoveryService.processIncomingGroupEvent(payload1)
    expect(res1.isDuplicate).toBe(false)
    expect(res1.group.groupName).toBe("Dhaka Buy and Sell Market")

    // 2. Duplicate event check
    const res2 = discoveryService.processIncomingGroupEvent(payload1)
    expect(res2.isDuplicate).toBe(true)
  })

  it("should classify group category, language, and priority correctly", () => {
    // BUY_SELL & Bangla & HIGH
    const res1 = classificationService.classifyGroup("Dhaka Buy and Sell Bazaar", "Kinbo bhai dam koto?")
    expect(res1.category).toBe("BUY_SELL")
    expect(res1.language).toBe("Bangla")
    expect(res1.priority).toBe("HIGH")

    // SUPPORT & English & MEDIUM
    const res2 = classificationService.classifyGroup("Customer Support Hub", "Need help with my account service")
    expect(res2.category).toBe("SUPPORT")
    expect(res2.language).toBe("English")
    expect(res2.priority).toBe("MEDIUM")

    // COMMUNITY & Spanish & LOW
    const res3 = classificationService.classifyGroup("Grupo de Amigos", "Hola todos gracias")
    expect(res3.category).toBe("COMMUNITY")
    expect(res3.language).toBe("Spanish")
    expect(res3.priority).toBe("LOW")
  })

  it("should prepare campaign queue item without sending", () => {
    const item = campaignPrepService.prepareCampaignQueueItem({
      groupId: "grp-555",
      workspaceId: "ws-555",
      accountId: "acc-555",
      campaignDetails: { category: "BUY_SELL" }
    })

    expect(item.campaignId).toBeDefined()
    expect(item.status).toBe("PREPARED")
    expect(campaignPrepService.getPreparedCampaign(item.campaignId)).toBeDefined()
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:messenger_group:${groupId}, route through group foundation pipeline, and publish framework events with eventVersion 1.0", async () => {
    const job: AutomationJob = {
      id: "group-job-1",
      correlationId: "corr-mg-1",
      workspaceId: "ws-mg-test",
      jobType: "messenger_group_assistant",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-mg-test",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 24 },
      dailyLimits: { messenger_group_assistant: 200 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: MessengerGroupTask = {
      groupId: "grp-888",
      groupName: "E-Commerce Deals & Sales Group",
      participantCount: 150,
      lastMessage: "Special discount on all items today!"
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateGroupTask(job, "acc-mg-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.classification?.category).toBe("BUY_SELL")
    expect(runRes.campaignItem?.status).toBe("PREPARED")
    expect(stateMachine.getJobState("group-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("group-job-1")
    expect(timeline.length).toBe(7)
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
