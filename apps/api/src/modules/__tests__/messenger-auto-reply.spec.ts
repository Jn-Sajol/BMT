import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutoMessengerReplyPolicyService, AutoMessengerReplyPolicyConfig } from "../messenger-controller/application/services/auto-messenger-reply-policy.service"
import { ConversationReplyModeService } from "../messenger-controller/application/services/conversation-reply-mode.service"
import { MessengerReplySuggestionService } from "../messenger-controller/application/services/messenger-reply-suggestion.service"
import { FallbackReplyService } from "../messenger-controller/application/services/fallback-reply.service"
import { MessengerAutoReplyDelayService } from "../messenger-controller/application/services/messenger-auto-reply-delay.service"
import { MessengerAutoReplyStateMachine } from "../messenger-controller/application/services/messenger-auto-reply-state-machine.service"
import { MessengerAutoReplyJobCoordinator, MessengerAutoReplyTask } from "../messenger-controller/application/services/messenger-auto-reply-job-coordinator.service"
import { MessengerAutoReplyExecutionStrategy } from "../messenger-controller/application/services/messenger-auto-reply-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Messenger Controller Auto Reply Engine (F-62 / Client Requirement 12 Completion) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: MessengerAutoReplyStateMachine
  let policyService: PolicyService
  let autoReplyPolicyService: AutoMessengerReplyPolicyService
  let modeService: ConversationReplyModeService
  let suggestionService: MessengerReplySuggestionService
  let fallbackService: FallbackReplyService
  let delayCalculator: DelayCalculatorService
  let delayService: MessengerAutoReplyDelayService
  let featureFlagService: FeatureFlagService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: MessengerAutoReplyJobCoordinator
  let strategy: MessengerAutoReplyExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new MessengerAutoReplyStateMachine()
    policyService = new PolicyService()
    autoReplyPolicyService = new AutoMessengerReplyPolicyService(policyService)
    modeService = new ConversationReplyModeService()
    suggestionService = new MessengerReplySuggestionService()
    fallbackService = new FallbackReplyService()
    delayCalculator = new DelayCalculatorService()
    delayService = new MessengerAutoReplyDelayService(delayCalculator)
    featureFlagService = new FeatureFlagService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new MessengerAutoReplyJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      autoReplyPolicyService,
      modeService,
      suggestionService,
      fallbackService,
      delayService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new MessengerAutoReplyExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-auto-reply-plugin",
        name: "Facebook Messenger Auto Reply Engine",
        version: "1.0.0",
        description: "Messenger Auto Reply plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_AUTO_REPLY],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under MESSENGER_AUTO_REPLY capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.MESSENGER_AUTO_REPLY)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-messenger-auto-reply-plugin")
  })

  it("should enforce auto reply policy rules (working hours, cooldown, daily limits, blocked list)", async () => {
    const hbf: HumanBehaviourConfig = {
      accountId: "acc-ar-policy",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 24 },
      dailyLimits: { messenger_auto_reply: 50 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    const policyConfig: AutoMessengerReplyPolicyConfig = {
      isEnabled: true,
      workingHours: { startHour: 0, endHour: 24 },
      cooldownMinutes: 10,
      maxRepliesPerConversation: 2,
      maxRepliesPerAccountDaily: 5,
      blockedConversationIds: ["blocked-conv-1"]
    }

    // Blocked check
    const check1 = await autoReplyPolicyService.isAutoReplyAllowed("blocked-conv-1", "acc-ar-policy", hbf, policyConfig)
    expect(check1.allowed).toBe(false)
    expect(check1.reason).toContain("blocked list")

    // Normal allowed check
    const check2 = await autoReplyPolicyService.isAutoReplyAllowed("conv-ok-1", "acc-ar-policy", hbf, policyConfig)
    expect(check2.allowed).toBe(true)

    // Cooldown check
    autoReplyPolicyService.recordReply("conv-ok-1", "acc-ar-policy")
    const check3 = await autoReplyPolicyService.isAutoReplyAllowed("conv-ok-1", "acc-ar-policy", hbf, policyConfig)
    expect(check3.allowed).toBe(false)
    expect(check3.reason).toContain("Cooldown active")
  })

  it("should format reply by mode (Sales, Lead, Visit Conversion) correctly", () => {
    const baseReply = "Thank you for reaching out!"
    const salesReply = modeService.formatReplyByMode(baseReply, "Sales Conversion")
    expect(salesReply).toContain("10% instant discount")

    const leadReply = modeService.formatReplyByMode(baseReply, "Lead Conversion")
    expect(leadReply).toContain("share your email")

    const visitReply = modeService.formatReplyByMode(baseReply, "Visit Conversion")
    expect(visitReply).toContain("schedule an appointment")
  })

  it("should return fallback reply when confidence is below threshold 0.7", () => {
    const fallbackRes = fallbackService.getFallbackReply(0.5, 0.7)
    expect(fallbackRes.isFallbackUsed).toBe(true)
    expect(fallbackRes.replyText.length).toBeGreaterThan(0)

    const normalRes = fallbackService.getFallbackReply(0.9, 0.7)
    expect(normalRes.isFallbackUsed).toBe(false)
  })

  it("should calculate random 30s to 3m delay", () => {
    const context = {
      workspaceId: "ws-test",
      accountId: "acc-test",
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

    const { delaySeconds } = delayService.calculateAutoReplyDelay(context)
    expect(delaySeconds).toBeGreaterThanOrEqual(30)
    expect(delaySeconds).toBeLessThanOrEqual(180)
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:messenger_auto_reply:${conversationId}, route through auto reply pipeline, and publish framework events with eventVersion 1.0", async () => {
    const job: AutomationJob = {
      id: "auto-reply-job-1",
      correlationId: "corr-ar-1",
      workspaceId: "ws-ar",
      jobType: "messenger_auto_reply",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-ar-test",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 24 },
      dailyLimits: { messenger_auto_reply: 500 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    const task: MessengerAutoReplyTask = {
      conversationId: "conv-auto-777",
      pageId: "page-auto-888",
      senderId: "user-auto-999",
      messageText: "What is the price of this product?",
      replyMode: "Sales Conversion",
      policyConfig: {
        isEnabled: true,
        workingHours: { startHour: 0, endHour: 24 },
        cooldownMinutes: 0,
        maxRepliesPerConversation: 10,
        maxRepliesPerAccountDaily: 100,
        blockedConversationIds: []
      }
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateAutoReply(job, "acc-ar-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.replyText).toContain("10% instant discount")
    expect(runRes.delaySeconds).toBeGreaterThanOrEqual(30)
    expect(stateMachine.getJobState("auto-reply-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("auto-reply-job-1")
    expect(timeline.length).toBe(10)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
