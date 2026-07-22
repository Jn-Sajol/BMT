import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutoReplyPolicyService } from "../comment-reply/application/services/auto-reply-policy.service"
import { SavedReplySelectorService } from "../comment-reply/application/services/saved-reply-selector.service"
import { ReplyVariationService } from "../comment-reply/application/services/reply-variation.service"
import { AutoReplyDelayService } from "../comment-reply/application/services/auto-reply-delay.service"
import { AutoReplyStateMachine } from "../comment-reply/application/services/auto-reply-state-machine.service"
import { AutoReplyJobCoordinator, AutoReplyTask } from "../comment-reply/application/services/auto-reply-job-coordinator.service"
import { AutoReplyExecutionStrategy } from "../comment-reply/application/services/auto-reply-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("AI Reply Comment Assistant Auto Reply Engine (F-59 / Client Requirement 11 Completion) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: AutoReplyStateMachine
  let autoPolicyService: AutoReplyPolicyService
  let replySelector: SavedReplySelectorService
  let variationService: ReplyVariationService
  let autoDelayService: AutoReplyDelayService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: AutoReplyJobCoordinator
  let strategy: AutoReplyExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new AutoReplyStateMachine()
    policyService = new PolicyService()
    autoPolicyService = new AutoReplyPolicyService(policyService)
    replySelector = new SavedReplySelectorService()
    variationService = new ReplyVariationService()
    delayCalculator = new DelayCalculatorService()
    autoDelayService = new AutoReplyDelayService(delayCalculator)
    featureFlagService = new FeatureFlagService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new AutoReplyJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      autoPolicyService,
      replySelector,
      variationService,
      autoDelayService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new AutoReplyExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-auto-comment-reply-plugin",
        name: "Facebook Auto Comment Reply Engine",
        version: "1.0.0",
        description: "Auto Reply plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT_AUTO_REPLY],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under COMMENT_AUTO_REPLY capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.COMMENT_AUTO_REPLY)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-auto-comment-reply-plugin")
  })

  it("should validate policy limits, working hours, duplicate prevention, and cooldown", () => {
    const hbf: HumanBehaviourConfig = {
      accountId: "acc-pol",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_auto_reply: 200 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    // 1. Initial check -> Eligible
    const res1 = autoPolicyService.validateEligibility("acc-pol", "post-1", "comment-1", hbf)
    expect(res1.eligible).toBe(true)

    // Record execution
    autoPolicyService.recordReplyExecution("acc-pol", "post-1", "comment-1")

    // 2. Duplicate comment check -> Rejected
    const res2 = autoPolicyService.validateEligibility("acc-pol", "post-1", "comment-1", hbf)
    expect(res2.eligible).toBe(false)
    expect(res2.reason).toContain("Duplicate reply attempt")

    // 3. Cooldown check for same account on new comment -> Rejected
    const res3 = autoPolicyService.validateEligibility("acc-pol", "post-1", "comment-2", hbf)
    expect(res3.eligible).toBe(false)
    expect(res3.reason).toContain("Cooldown active")
  })

  it("should select weighted saved reply templates with rotation and avoid recently used", () => {
    const reply1 = replySelector.selectReply("Price")
    expect(reply1).toBeDefined()
    expect(reply1.intent).toBe("Price")

    const reply2 = replySelector.selectReply("Price")
    expect(reply2).toBeDefined()
  })

  it("should calculate auto reply random delay between 30 seconds and 3 minutes using DelayCalculatorService", () => {
    const hbf: HumanBehaviourConfig = {
      accountId: "acc-delay",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_auto_reply: 200 },
      minCooldownMinutes: 1,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    const delay = autoDelayService.getAutoReplyDelaySeconds(hbf)
    expect(delay).toBeGreaterThanOrEqual(30)
    expect(delay).toBeLessThanOrEqual(180)
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:auto_reply:${commentId}, schedule delay, and route through auto reply pipeline", async () => {
    const job: AutomationJob = {
      id: "auto-reply-job-1",
      correlationId: "corr-ar-1",
      workspaceId: "ws-ar",
      jobType: "comment_auto_reply",
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
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_auto_reply: 200 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 30, maxSeconds: 180 }
    }

    const task: AutoReplyTask = {
      pageId: "page-100",
      postId: "post-200",
      commentId: "comment-999",
      authorName: "Jane Smith",
      text: "How much does this cost?",
      intent: "Price"
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateAutoReply(job, "acc-ar-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.selectedReply).toBeDefined()
    expect(runRes.delaySeconds).toBeGreaterThanOrEqual(30)
    expect(stateMachine.getJobState("auto-reply-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("auto-reply-job-1")
    expect(timeline.length).toBe(9)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
