import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { CommentTargetParserService } from "../link-comment/application/services/comment-target-parser.service"
import { CommentBlockStateMachine } from "../link-comment/application/services/comment-block-state-machine.service"
import { CommentBlockJobCoordinator } from "../link-comment/application/services/comment-block-job-coordinator.service"
import { CommentBlockExecutionStrategy } from "../link-comment/application/services/comment-block-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Link Comment Block Scraper Foundation (F-54 / Client Req F-31) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: CommentBlockStateMachine
  let parserService: CommentTargetParserService
  let delayCalculator: DelayCalculatorService
  let registryService: AutomationRegistryService
  let coordinator: CommentBlockJobCoordinator
  let strategy: CommentBlockExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new CommentBlockStateMachine()
    parserService = new CommentTargetParserService()
    delayCalculator = new DelayCalculatorService()
    registryService = new AutomationRegistryService()
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new CommentBlockJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      parserService,
      delayCalculator,
      eventBus
    )
    strategy = new CommentBlockExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-block-plugin",
        name: "Facebook Comment Block Scraper Foundation",
        version: "1.0.0",
        description: "Comment Block Discovery plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT_BLOCK_DISCOVERY],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under COMMENT_BLOCK_DISCOVERY capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.COMMENT_BLOCK_DISCOVERY)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-comment-block-plugin")
  })

  it("should normalize, validate, and classify Facebook post URLs", () => {
    const rawUrl = "https://facebook.com/groups/12345/posts/67890?fbclid=xyz123"
    const payload = parserService.prepareParserPayload("target-100", rawUrl, new Set())

    expect(payload.normalizedUrl).toBe("https://facebook.com/groups/12345/posts/67890")
    expect(payload.classification).toBe("GROUP_POST")
    expect(payload.isValid).toBe(true)
    expect(payload.isDuplicate).toBe(false)
  })

  it("should register target, acquire lock lock:${workspaceId}:${accountId}:comment_block:${targetId}, and route through parsing pipeline", async () => {
    const job: AutomationJob = {
      id: "comment-block-job-1",
      correlationId: "corr-cb-1",
      workspaceId: "ws-cb",
      jobType: "comment_block_discovery",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-cb",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_block_discovery: 30 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateBlockScraper(
      job,
      "acc-cb",
      "target-200",
      "https://facebook.com/posts/pfbid02xXyZ",
      hbf
    )

    expect(runRes.success).toBe(true)
    expect(runRes.payload?.classification).toBe("PAGE_POST")
    expect(stateMachine.getJobState("comment-block-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("comment-block-job-1")
    expect(timeline.length).toBe(7)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
