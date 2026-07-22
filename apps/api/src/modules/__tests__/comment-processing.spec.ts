import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { CommentProcessingService } from "../link-comment/application/services/comment-processing.service"
import { LeadScoreService } from "../link-comment/application/services/lead-score.service"
import { LeadCandidateBuilder } from "../link-comment/application/services/lead-candidate-builder.service"
import { CommentProcessingStateMachine } from "../link-comment/application/services/comment-processing-state-machine.service"
import { CommentProcessingJobCoordinator, CollectionBatchTask } from "../link-comment/application/services/comment-processing-job-coordinator.service"
import { CommentProcessingExecutionStrategy } from "../link-comment/application/services/comment-processing-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("AI Comment Processing & Lead Extraction Foundation (F-56 / Client Req F-31 Processing) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: CommentProcessingStateMachine
  let processingService: CommentProcessingService
  let leadScoreService: LeadScoreService
  let leadCandidateBuilder: LeadCandidateBuilder
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: CommentProcessingJobCoordinator
  let strategy: CommentProcessingExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new CommentProcessingStateMachine()
    processingService = new CommentProcessingService()
    leadScoreService = new LeadScoreService()
    leadCandidateBuilder = new LeadCandidateBuilder(leadScoreService)
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new CommentProcessingJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      processingService,
      leadCandidateBuilder,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new CommentProcessingExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-processing-plugin",
        name: "Facebook Comment Processing & Lead Extraction Foundation",
        version: "1.0.0",
        description: "Comment Processing plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.COMMENT_PROCESSING],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under COMMENT_PROCESSING capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.COMMENT_PROCESSING)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-comment-processing-plugin")
  })

  it("should normalize, deduplicate, filter, and score lead comments correctly", () => {
    const rawComments = [
      { commentId: "c1", authorId: "u1", text: "I want to buy this item. Phone: 01712345678" },
      { commentId: "c1", authorId: "u1", text: "Duplicate comment" },
      { commentId: "c2", authorId: "u2", text: "[deleted]" },
      { commentId: "c3", authorId: "u3", text: "   " },
      { commentId: "c4", authorId: "u4", text: "এটার দাম কত? Dhaka delivery lagbe" }
    ]

    const batch = processingService.processBatch("b-100", rawComments)
    expect(batch.processedCount).toBe(2)
    expect(batch.duplicatesRemoved).toBe(1)
    expect(batch.deletedRemoved).toBe(1)
    expect(batch.emptyRemoved).toBe(1)

    const lead1 = leadCandidateBuilder.buildLeadCandidate(batch.comments[0], ["buy"])
    expect(lead1.leadScore).toBeGreaterThanOrEqual(70) // Buying intent + Phone + Keyword
    expect(lead1.contactHints.phone).toBe("01712345678")

    const lead2 = leadCandidateBuilder.buildLeadCandidate(batch.comments[1], ["দাম"])
    expect(lead2.detectedLanguage).toBe("BN")
  })

  it("should consume batch, acquire lock lock:${workspaceId}:${accountId}:comment_processing:${batchId}, and route through processing pipeline", async () => {
    const job: AutomationJob = {
      id: "comment-proc-job-1",
      correlationId: "corr-cp-1",
      workspaceId: "ws-cp",
      jobType: "comment_processing",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-cp",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { comment_processing: 100 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: CollectionBatchTask = {
      batchId: "batch-500",
      targetId: "target-300",
      rawComments: [
        { commentId: "c-501", authorId: "user-1", text: "How much for this product? Price please in inbox" }
      ],
      customKeywords: ["price"]
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateProcessing(job, "acc-cp", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.leads?.length).toBe(1)
    expect(stateMachine.getJobState("comment-proc-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("comment-proc-job-1")
    expect(timeline.length).toBe(8)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
