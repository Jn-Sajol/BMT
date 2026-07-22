import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { CommentCollectionStateMachine } from "../link-comment/application/services/comment-collection-state-machine.service"
import { CommentCollectionJobCoordinator, ParsedCollectionTask } from "../link-comment/application/services/comment-collection-job-coordinator.service"
import { CommentCollectionExecutionStrategy } from "../link-comment/application/services/comment-collection-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Link Comment Collection Orchestration (F-55 / Client Req F-31 Collection) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: CommentCollectionStateMachine
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: CommentCollectionJobCoordinator
  let strategy: CommentCollectionExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new CommentCollectionStateMachine()
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new CommentCollectionJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new CommentCollectionExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-collection-plugin",
        name: "Facebook Comment Collection Orchestration",
        version: "1.0.0",
        description: "Comment Collection plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT_COLLECTION],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under COMMENT_COLLECTION capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.COMMENT_COLLECTION)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-comment-collection-plugin")
  })

  it("should consume parsed target, acquire lock lock:${workspaceId}:${accountId}:comment_collection:${targetId}, and route through collection pipeline queues", async () => {
    const job: AutomationJob = {
      id: "comment-col-job-1",
      correlationId: "corr-cc-1",
      workspaceId: "ws-cc",
      jobType: "comment_collection",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-cc",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_collection: 40 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: ParsedCollectionTask = {
      targetId: "target-300",
      normalizedUrl: "https://facebook.com/groups/999/posts/888",
      classification: "GROUP_POST"
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateCollection(job, "acc-cc", task, hbf)

    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("comment-col-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("comment-col-job-1")
    expect(timeline.length).toBe(8)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
