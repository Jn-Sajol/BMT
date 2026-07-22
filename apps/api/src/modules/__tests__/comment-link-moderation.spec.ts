import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { CommentLinkDetectionService } from "../link-comment/application/services/comment-link-detection.service"
import { CommentDeletionVerificationService } from "../link-comment/application/services/comment-deletion-verification.service"
import { ModerationAuditService } from "../link-comment/application/services/moderation-audit.service"
import { CommentModerationStateMachine } from "../link-comment/application/services/comment-moderation-state-machine.service"
import { CommentModerationJobCoordinator, IncomingCommentTask } from "../link-comment/application/services/comment-moderation-job-coordinator.service"
import { CommentModerationExecutionStrategy } from "../link-comment/application/services/comment-moderation-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Link Comment Auto Delete Engine (F-57 / Client Requirement 16) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: CommentModerationStateMachine
  let detectionService: CommentLinkDetectionService
  let verificationService: CommentDeletionVerificationService
  let auditService: ModerationAuditService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: CommentModerationJobCoordinator
  let strategy: CommentModerationExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new CommentModerationStateMachine()
    detectionService = new CommentLinkDetectionService()
    verificationService = new CommentDeletionVerificationService()
    auditService = new ModerationAuditService()
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new CommentModerationJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      detectionService,
      verificationService,
      auditService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new CommentModerationExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-link-moderation-plugin",
        name: "Facebook Link Comment Auto Delete Engine",
        version: "1.0.0",
        description: "Comment Moderation plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT_LINK_MODERATION],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under COMMENT_LINK_MODERATION capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.COMMENT_LINK_MODERATION)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-comment-link-moderation-plugin")
  })

  it("should detect links, evaluate allow list and block list rules correctly", () => {
    const textWithLink = "Check this out https://spam.com/offer"
    const textWithAllowed = "Visit our site https://mycompany.com/blog"
    const textWithShortened = "Click bit.ly/abc1234"

    // 1. Unlisted link -> Blocked by default link policy
    const res1 = detectionService.evaluateComment(textWithLink, ["mycompany.com"], [])
    expect(res1.hasLink).toBe(true)
    expect(res1.isBlocked).toBe(true)

    // 2. Allow List link -> Allowed
    const res2 = detectionService.evaluateComment(textWithAllowed, ["mycompany.com"], [])
    expect(res2.hasLink).toBe(true)
    expect(res2.isBlocked).toBe(false)

    // 3. Shortened link -> Blocked
    const res3 = detectionService.evaluateComment(textWithShortened, [], [])
    expect(res3.hasLink).toBe(true)
    expect(res3.isBlocked).toBe(true)
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:comment_delete:${commentId}, execute delete workflow, verify, and record audit log", async () => {
    const job: AutomationJob = {
      id: "comment-mod-job-1",
      correlationId: "corr-cm-1",
      workspaceId: "ws-cm",
      jobType: "comment_link_moderation",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-cm",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_link_moderation: 500 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: IncomingCommentTask = {
      pageId: "page-10",
      postId: "post-20",
      commentId: "comment-999",
      text: "Free gifts at https://scam-site.com/free",
      allowList: [],
      blockList: ["scam-site.com"]
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateModeration(job, "acc-cm", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.deleted).toBe(true)
    expect(stateMachine.getJobState("comment-mod-job-1")).toBe("Completed")

    const auditLogs = auditService.getLogsByWorkspace("ws-cm")
    expect(auditLogs.length).toBe(1)
    expect(auditLogs[0].result).toBe("Deleted")
    expect(auditLogs[0].commentId).toBe("comment-999")

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
