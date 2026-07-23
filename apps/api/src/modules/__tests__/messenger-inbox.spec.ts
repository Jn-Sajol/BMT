import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { MessengerInboxService } from "../messenger-controller/application/services/messenger-inbox.service"
import { ConversationClassificationService } from "../messenger-controller/application/services/conversation-classification.service"
import { MessengerInboxStateMachine } from "../messenger-controller/application/services/messenger-inbox-state-machine.service"
import { MessengerInboxJobCoordinator, MessengerConversationTask } from "../messenger-controller/application/services/messenger-inbox-job-coordinator.service"
import { MessengerInboxExecutionStrategy } from "../messenger-controller/application/services/messenger-inbox-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Messenger Controller Foundation (F-60 / Client Requirement 12) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: MessengerInboxStateMachine
  let inboxService: MessengerInboxService
  let classificationService: ConversationClassificationService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: MessengerInboxJobCoordinator
  let strategy: MessengerInboxExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new MessengerInboxStateMachine()
    inboxService = new MessengerInboxService()
    classificationService = new ConversationClassificationService()
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new MessengerInboxJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      inboxService,
      classificationService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new MessengerInboxExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-inbox-plugin",
        name: "Facebook Messenger Inbox Controller Foundation",
        version: "1.0.0",
        description: "Messenger Inbox plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_INBOX],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under MESSENGER_INBOX capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.MESSENGER_INBOX)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-messenger-inbox-plugin")
  })

  it("should normalize conversation payload, deduplicate messageId, and group by Page", () => {
    const payload1 = {
      conversationId: "conv-100",
      pageId: "page-1",
      accountId: "acc-1",
      senderId: "sender-1",
      senderName: "Alice",
      messageId: "msg-001",
      messageText: "Hello, what is the price?"
    }

    // 1. Process initial message
    const res1 = inboxService.processIncomingConversation(payload1)
    expect(res1.isDuplicate).toBe(false)
    expect(res1.conversation.unreadCount).toBe(1)
    expect(res1.conversation.lastMessageText).toBe("Hello, what is the price?")

    // 2. Duplicate messageId check
    const res2 = inboxService.processIncomingConversation(payload1)
    expect(res2.isDuplicate).toBe(true)

    // 3. Group by page
    const grouped = inboxService.getGroupedByPage()
    expect(grouped.length).toBe(1)
    expect(grouped[0].totalConversations).toBe(1)
  })

  it("should classify category, detect language, and assign priority correctly", () => {
    // Sales & Bengali
    const res1 = classificationService.classifyConversation("Ei jinishtar koto dam?", true)
    expect(res1.category).toBe("SALES")
    expect(res1.language).toBe("Bengali")
    expect(res1.priority).toBe("HIGH")

    // Support & English
    const res2 = classificationService.classifyConversation("My order is broken and not working", false)
    expect(res2.category).toBe("SUPPORT")
    expect(res2.language).toBe("English")
    expect(res2.priority).toBe("HIGH")

    // Spanish & General
    const res3 = classificationService.classifyConversation("Hola buenos dias", false)
    expect(res3.category).toBe("GENERAL")
    expect(res3.language).toBe("Spanish")
    expect(res3.priority).toBe("LOW")
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:messenger_inbox:${conversationId}, route through pipeline, and publish framework events with eventVersion 1.0", async () => {
    const job: AutomationJob = {
      id: "msg-inbox-job-1",
      correlationId: "corr-mi-1",
      workspaceId: "ws-mi",
      jobType: "messenger_inbox",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-mi-test",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { messenger_inbox: 500 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: MessengerConversationTask = {
      conversationId: "conv-555",
      pageId: "page-888",
      senderId: "user-777",
      senderName: "Robert Green",
      messageId: "msg-777-1",
      messageText: "Need urgent help with my account issue",
      metadata: { source: "messenger_webhook" }
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateInbox(job, "acc-mi-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.classification?.category).toBe("SUPPORT")
    expect(runRes.classification?.priority).toBe("HIGH")
    expect(stateMachine.getJobState("msg-inbox-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("msg-inbox-job-1")
    expect(timeline.length).toBe(8)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
