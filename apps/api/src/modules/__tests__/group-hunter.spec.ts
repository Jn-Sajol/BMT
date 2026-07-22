import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { GroupRankingService } from "../group-hunter/application/services/group-ranking.service"
import { GroupClassificationService } from "../group-hunter/application/services/group-classification.service"
import { GroupHunterStateMachine } from "../group-hunter/application/services/group-hunter-state-machine.service"
import { GroupHunterJobCoordinator } from "../group-hunter/application/services/group-hunter-job-coordinator.service"
import { GroupHunterExecutionStrategy } from "../group-hunter/application/services/group-hunter-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Group Hunter Discovery Engine (F-52 / Client Req F-32) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: GroupHunterStateMachine
  let rankingService: GroupRankingService
  let classificationService: GroupClassificationService
  let delayCalculator: DelayCalculatorService
  let registryService: AutomationRegistryService
  let coordinator: GroupHunterJobCoordinator
  let strategy: GroupHunterExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new GroupHunterStateMachine()
    rankingService = new GroupRankingService()
    classificationService = new GroupClassificationService()
    delayCalculator = new DelayCalculatorService()
    registryService = new AutomationRegistryService()
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new GroupHunterJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      rankingService,
      classificationService,
      delayCalculator,
      eventBus
    )
    strategy = new GroupHunterExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-hunter-plugin",
        name: "Facebook Group Hunter Discovery Engine",
        version: "1.0.0",
        description: "Group Discovery plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.GROUP_DISCOVERY],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under GROUP_DISCOVERY capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.GROUP_DISCOVERY)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-group-hunter-plugin")
  })

  it("should classify group metadata correctly", () => {
    const res = classificationService.classifyGroup("Bangladesh Buy and Sell Market", "Buy and sell items here")
    expect(res.category).toBe("E-Commerce")
    expect(res.groupType).toBe("BUY_SELL")
  })

  it("should score, rank, and process candidate groups through discovery coordinator", async () => {
    const job: AutomationJob = {
      id: "gh-job-1",
      correlationId: "corr-gh-1",
      workspaceId: "ws-gh",
      jobType: "group_discovery",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-gh",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { group_discovery: 20 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const rawCandidates = [
      { id: "grp-1", name: "Dhaka Tech Developers", description: "Software dev group", memberCount: 15000, privacy: "PUBLIC" as const },
      { id: "grp-2", name: "Dhaka Buy Sell Bazar", description: "E-Commerce buy sell", memberCount: 60000, privacy: "PUBLIC" as const }
    ]

    const discoveryRes = await coordinator.coordinateDiscovery(job, ["Dhaka", "Tech"], rawCandidates, hbf)

    expect(discoveryRes.success).toBe(true)
    expect(discoveryRes.candidateCount).toBe(2)
    expect(stateMachine.getJobState("gh-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("gh-job-1")
    expect(timeline.length).toBe(6)
    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
