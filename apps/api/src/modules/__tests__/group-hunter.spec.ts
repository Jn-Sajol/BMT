import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { PayloadValidatorService } from "../automation-core/application/services/payload-validator.service"
import { PolicyService } from "../automation-core/application/services/policy.service"
import { FeatureFlagService } from "../automation-core/application/services/feature-flag.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { GroupDiscoveryService } from "../group-hunter/application/services/group-discovery.service"
import { GroupFilteringService } from "../group-hunter/application/services/group-filtering.service"
import { GroupScoringService } from "../group-hunter/application/services/group-scoring.service"
import { GroupCandidateQueueService } from "../group-hunter/application/services/group-candidate-queue.service"
import { GroupExportService } from "../group-hunter/application/services/group-export.service"
import { GroupHunterStateMachine } from "../group-hunter/application/services/group-hunter-state-machine.service"
import { GroupHunterJobCoordinator, GroupHunterTask } from "../group-hunter/application/services/group-hunter-job-coordinator.service"
import { GroupHunterExecutionStrategy } from "../group-hunter/application/services/group-hunter-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Facebook Group Hunter & Messenger Group Link Finder (F-65 / Client Requirement 17) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: GroupHunterStateMachine
  let discoveryService: GroupDiscoveryService
  let filteringService: GroupFilteringService
  let scoringService: GroupScoringService
  let candidateQueueService: GroupCandidateQueueService
  let exportService: GroupExportService
  let delayCalculator: DelayCalculatorService
  let featureFlagService: FeatureFlagService
  let policyService: PolicyService
  let registryService: AutomationRegistryService
  let payloadValidator: PayloadValidatorService
  let coordinator: GroupHunterJobCoordinator
  let strategy: GroupHunterExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new GroupHunterStateMachine()
    discoveryService = new GroupDiscoveryService()
    filteringService = new GroupFilteringService()
    scoringService = new GroupScoringService()
    candidateQueueService = new GroupCandidateQueueService()
    exportService = new GroupExportService()
    delayCalculator = new DelayCalculatorService()
    featureFlagService = new FeatureFlagService()
    policyService = new PolicyService()
    registryService = new AutomationRegistryService()
    payloadValidator = new PayloadValidatorService(registryService, featureFlagService, policyService)
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new GroupHunterJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      discoveryService,
      filteringService,
      scoringService,
      candidateQueueService,
      exportService,
      delayCalculator,
      payloadValidator,
      policyService,
      registryService,
      eventBus
    )
    strategy = new GroupHunterExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-hunter-plugin",
        name: "Facebook Group Hunter & Messenger Group Link Finder",
        version: "1.0.0",
        description: "Group Hunter plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.GROUP_HUNTER],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under GROUP_HUNTER capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.GROUP_HUNTER)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-group-hunter-plugin")
  })

  it("should normalize discovered group metadata and deduplicate groupId", () => {
    const raw1 = { groupId: "gh-101", groupName: "Dhaka Marketers Group", workspaceId: "ws-gh", accountId: "acc-gh" }
    const res1 = discoveryService.processDiscoveredGroup(raw1)
    expect(res1.isDuplicate).toBe(false)
    expect(res1.group.groupName).toBe("Dhaka Marketers Group")

    const res2 = discoveryService.processDiscoveredGroup(raw1)
    expect(res2.isDuplicate).toBe(true)
  })

  it("should filter groups by member count, privacy, and keywords", () => {
    const groups = [
      { groupId: "g1", groupName: "Dhaka Tech Deals", groupUrl: "url1", memberCount: 15000, privacy: "PUBLIC", language: "English", category: "TECH", lastActivity: new Date(), description: "buy sell tech", workspaceId: "w", accountId: "a" },
      { groupId: "g2", groupName: "Small Private Group", groupUrl: "url2", memberCount: 100, privacy: "PRIVATE", language: "English", category: "GENERAL", lastActivity: new Date(), description: "chat", workspaceId: "w", accountId: "a" }
    ] as any[]

    const filtered = filteringService.filterGroups(groups, { minMemberCount: 1000, privacy: "PUBLIC", keywords: ["tech"] })
    expect(filtered.length).toBe(1)
    expect(filtered[0].groupId).toBe("g1")
  })

  it("should score group and rank into HIGH, MEDIUM, LOW", () => {
    const group = {
      groupId: "g-score-1",
      groupName: "E-Commerce Buy and Sell",
      groupUrl: "url",
      memberCount: 60000,
      privacy: "PUBLIC" as const,
      language: "English",
      category: "BUY_SELL",
      lastActivity: new Date(),
      description: "Buy sell products deal",
      workspaceId: "w",
      accountId: "a"
    }

    const scoreRes = scoringService.calculateGroupScore(group, ["buy", "sell"], "BUY_SELL", "English")
    expect(scoreRes.numericScore).toBeGreaterThanOrEqual(70)
    expect(scoreRes.rank).toBe("HIGH")
  })

  it("should manage candidate review queue and export candidate list in CSV, JSON, EXCEL", () => {
    const group = { groupId: "g-queue-1", groupName: "Deals Club", groupUrl: "url", memberCount: 5000, privacy: "PUBLIC" as const, language: "English", category: "DEALS", lastActivity: new Date(), description: "deals", workspaceId: "w", accountId: "a" }
    const scoreRes = scoringService.calculateGroupScore(group, ["deals"])

    const candidate = candidateQueueService.addCandidateToQueue(group, scoreRes)
    expect(candidate.status).toBe("Pending")

    candidateQueueService.updateCandidateStatus(candidate.candidateId, "Approved")
    expect(candidateQueueService.getCandidatesByStatus("Approved").length).toBe(1)

    const csvExport = exportService.exportCandidates([candidate], "CSV")
    expect(csvExport.content).toContain("CandidateID")

    const jsonExport = exportService.exportCandidates([candidate], "JSON")
    expect(jsonExport.content).toContain("g-queue-1")
  })

  it("should acquire lock lock:${workspaceId}:${accountId}:group_hunter:${workspaceId}, route through group hunter pipeline, and publish framework events with eventVersion 1.0", async () => {
    const job: AutomationJob = {
      id: "gh-job-1",
      correlationId: "corr-gh-1",
      workspaceId: "ws-gh-test",
      jobType: "group_hunter",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-gh-test",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 24 },
      dailyLimits: { group_hunter: 300 },
      minCooldownMinutes: 0,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const task: GroupHunterTask = {
      rawGroups: [
        { groupId: "grp-h1", groupName: "Bangladesh E-Commerce Hub", memberCount: 25000, privacy: "PUBLIC", category: "BUY_SELL", description: "Buy sell promo" },
        { groupId: "grp-h2", groupName: "Local Neighborhood Group", memberCount: 200, privacy: "PRIVATE", category: "LOCAL" }
      ],
      targetKeywords: ["e-commerce", "buy"],
      exportFormat: "JSON"
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateGroupHunterTask(job, "acc-gh-test", task, hbf)

    expect(runRes.success).toBe(true)
    expect(runRes.discoveredCount).toBe(2)
    expect(runRes.candidates.length).toBe(2)
    expect(runRes.exportResult?.format).toBe("JSON")
    expect(stateMachine.getJobState("gh-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("gh-job-1")
    expect(timeline.length).toBe(9)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
