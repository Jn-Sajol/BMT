import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { CommentInboxService } from "../comment-reply/application/services/comment-inbox.service"
import { ReplyVariationService } from "../comment-reply/application/services/reply-variation.service"
import { ReplySuggestionService } from "../comment-reply/application/services/reply-suggestion.service"
import { CommentReplyStateMachine } from "../comment-reply/application/services/comment-reply-state-machine.service"
import { CommentReplyJobCoordinator, CommentReplyTask } from "../comment-reply/application/services/comment-reply-job-coordinator.service"
import { CommentReplyExecutionStrategy } from "../comment-reply/application/services/comment-reply-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("AI Reply Comment Assistant Foundation (F-58 / Client Requirement 11) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: CommentReplyStateMachine
  let inboxService: CommentInboxService
  let variationService: ReplyVariationService
  let suggestionService: ReplySuggestionService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: CommentReplyJobCoordinator
  let strategy: CommentReplyExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new CommentReplyStateMachine()
    inboxService = new CommentInboxService()
    variationService = new ReplyVariationService()
    suggestionService = new ReplySuggestionService({} as any, variationService)
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new CommentReplyJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      inboxService,
      suggestionService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new CommentReplyExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-reply-plugin",
        name: "Facebook AI Reply Comment Assistant Foundation",
        version: "1.0.0",
        description: "Comment Reply plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT_REPLY_ASSISTANT],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under COMMENT_REPLY_ASSISTANT capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.COMMENT_REPLY_ASSISTANT)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-comment-reply-plugin")
  })

  it("should classify comment intent and generate variations using local rule-based logic", () => {
    const intent1 = suggestionService.classifyIntent("What is the price of this item?")
    expect(intent1).toBe("Price")

    const intent2 = suggestionService.classifyIntent("Assalamu Alaikum brother")
    expect(intent2).toBe("Greeting")

    const res = suggestionService.generateSuggestionsLocal("Dam koto?")
    expect(res.intentCategory).toBe("Price")
    expect(res.suggestions.length).toBeGreaterThan(0)
  })

  it("should receive comment event, filter duplicates, and group by page/post", () => {
    const res1 = inboxService.receiveIncomingEvent({
      commentId: "comm-1",
      pageId: "page-1",
      postId: "post-1",
      text: "How much?"
    })
    expect(res1.isDuplicate).toBe(false)

    const res2 = inboxService.receiveIncomingEvent({
      commentId: "comm-1",
      pageId: "page-1",
      postId: "post-1",
      text: "How much?"
    })
    expect(res2.isDuplicate).toBe(true)

    const grouped = inboxService.getGroupedInbox()
    expect(grouped.length).toBe(1)
    expect(grouped[0].totalComments).toBe(1)
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:comment_reply:${commentId}, and route through reply assistant pipeline", async () => {
    const job: AutomationJob = {
      id: "comment-reply-job-1",
      correlationId: "corr-cr-1",
      workspaceId: "ws-cr",
      jobType: "comment_reply_assistant",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-cr",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_reply_assistant: 200 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: CommentReplyTask = {
      pageId: "page-50",
      postId: "post-60",
      commentId: "comment-777",
      authorName: "John Doe",
      text: "Can I order this?",
      autoApprove: false
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateReply(job, "acc-cr", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.suggestion?.intentCategory).toBe("Order")
    expect(stateMachine.getJobState("comment-reply-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("comment-reply-job-1")
    expect(timeline.length).toBe(8)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
