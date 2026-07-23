import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { MessengerReplySuggestionService } from "../messenger-controller/application/services/messenger-reply-suggestion.service"
import { MessengerManualApprovalService } from "../messenger-controller/application/services/messenger-manual-approval.service"
import { MessengerReplyLibraryService } from "../messenger-controller/application/services/messenger-reply-library.service"
import { MessengerManualReplyStateMachine } from "../messenger-controller/application/services/messenger-manual-reply-state-machine.service"
import { MessengerManualReplyJobCoordinator, MessengerManualReplyTask } from "../messenger-controller/application/services/messenger-manual-reply-job-coordinator.service"
import { MessengerManualReplyExecutionStrategy } from "../messenger-controller/application/services/messenger-manual-reply-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Messenger Controller Manual Reply Assistant (F-61 / Client Requirement 12) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: MessengerManualReplyStateMachine
  let suggestionService: MessengerReplySuggestionService
  let approvalService: MessengerManualApprovalService
  let libraryService: MessengerReplyLibraryService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: MessengerManualReplyJobCoordinator
  let strategy: MessengerManualReplyExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new MessengerManualReplyStateMachine()
    suggestionService = new MessengerReplySuggestionService()
    approvalService = new MessengerManualApprovalService()
    libraryService = new MessengerReplyLibraryService()
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new MessengerManualReplyJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      suggestionService,
      approvalService,
      libraryService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new MessengerManualReplyExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-manual-reply-plugin",
        name: "Facebook Messenger Manual Reply Assistant",
        version: "1.0.0",
        description: "Messenger Manual Reply plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_MANUAL_REPLY],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under MESSENGER_MANUAL_REPLY capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.MESSENGER_MANUAL_REPLY)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-messenger-manual-reply-plugin")
  })

  it("should detect intent, language, and generate single rule-based reply suggestion", () => {
    const res1 = suggestionService.analyzeMessage("How much is this item?")
    expect(res1.detectedIntent).toBe("price")
    expect(res1.detectedLanguage).toBe("English")
    expect(res1.confidence).toBeGreaterThanOrEqual(0.8)
    expect(res1.suggestedReply).toContain("pricing details")

    const res2 = suggestionService.analyzeMessage("Ei jinishtar koto dam?")
    expect(res2.detectedIntent).toBe("price")
    expect(res2.detectedLanguage).toBe("Bengali")
    expect(res2.suggestedReply).toContain("ইনবক্সে")
  })

  it("should manage manual approval state transitions (approve, edit, reject, library)", () => {
    const record = approvalService.createApprovalRecord("conv-1", "Help me", "Hi, how can we help?")
    expect(record.status).toBe("Pending")

    const edited = approvalService.editSuggestion(record.id, "Hi, our support team is available now.")
    expect(edited.status).toBe("Edited")
    expect(edited.finalReply).toBe("Hi, our support team is available now.")

    const approved = approvalService.approveSuggestion(record.id, "moderator-1")
    expect(approved.status).toBe("Approved")
  })

  it("should query saved replies from library, filter by category, and track usage", () => {
    const priceReplies = libraryService.searchReplies("", "Price")
    expect(priceReplies.length).toBeGreaterThan(0)

    const initialUse = priceReplies[0].useCount
    libraryService.incrementUseCount(priceReplies[0].id)
    expect(priceReplies[0].useCount).toBe(initialUse + 1)
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:manual_reply:${conversationId}, route through manual reply pipeline, and publish framework events with eventVersion 1.0", async () => {
    const job: AutomationJob = {
      id: "manual-reply-job-1",
      correlationId: "corr-mr-1",
      workspaceId: "ws-mr",
      jobType: "messenger_manual_reply",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-mr-test",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { messenger_manual_reply: 300 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: MessengerManualReplyTask = {
      conversationId: "conv-888",
      pageId: "page-999",
      senderId: "user-111",
      messageText: "Do you offer cash on delivery?",
      action: "APPROVE"
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateManualReply(job, "acc-mr-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.suggestion?.detectedIntent).toBe("delivery")
    expect(runRes.approvalRecord?.status).toBe("Approved")
    expect(stateMachine.getJobState("manual-reply-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("manual-reply-job-1")
    expect(timeline.length).toBe(7)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
