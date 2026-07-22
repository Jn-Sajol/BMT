import { RedisLockManager } from "../automation-core/infrastructure/redis-lock.manager"
import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { DelayCalculatorService } from "../automation-core/application/services/delay-calculator.service"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { GroupAutoJoinStateMachine } from "../group-hunter/application/services/group-autojoin-state-machine.service"
import { GroupAutoJoinJobCoordinator, CandidateJoinTask } from "../group-hunter/application/services/group-autojoin-job-coordinator.service"
import { GroupAutoJoinExecutionStrategy } from "../group-hunter/application/services/group-autojoin-execution-strategy.service"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"
import { AutomationJob, HumanBehaviourConfig } from "../automation-core/domain/automation-core.model"
import { InMemoryEventBus } from "../automation/infrastructure/bus/in-memory-event-bus"

describe("Group Auto Join Engine Foundation (F-53 / Client Req F-32 Execution) Unit Tests", () => {
  let lockManager: RedisLockManager
  let queueAdapter: BullMQQueueAdapter
  let stateMachine: GroupAutoJoinStateMachine
  let delayCalculator: DelayCalculatorService
  let registryService: AutomationRegistryService
  let coordinator: GroupAutoJoinJobCoordinator
  let strategy: GroupAutoJoinExecutionStrategy
  let eventBus: InMemoryEventBus
  let facebookDriver: FacebookDriver

  beforeEach(() => {
    lockManager = new RedisLockManager()
    queueAdapter = new BullMQQueueAdapter()
    stateMachine = new GroupAutoJoinStateMachine()
    delayCalculator = new DelayCalculatorService()
    registryService = new AutomationRegistryService()
    eventBus = new InMemoryEventBus()
    facebookDriver = new FacebookDriver()

    coordinator = new GroupAutoJoinJobCoordinator(
      lockManager,
      queueAdapter,
      stateMachine,
      delayCalculator,
      eventBus
    )
    strategy = new GroupAutoJoinExecutionStrategy(queueAdapter)

    registryService.registerDriver(facebookDriver)
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-group-autojoin-plugin",
        name: "Facebook Group Auto Join Engine",
        version: "1.0.0",
        description: "Group Auto Join plugin",
        platform: "facebook"
      },
      driver: facebookDriver,
      capabilities: [AutomationCapability.GROUP_AUTO_JOIN],
      executionStrategy: strategy,
      jobCoordinator: coordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }
    registryService.registerPlugin(plugin)
  })

  it("should verify plugin registration under GROUP_AUTO_JOIN capability", () => {
    const plugin = registryService.getPluginByCapability("facebook", AutomationCapability.GROUP_AUTO_JOIN)
    expect(plugin).toBeDefined()
    expect(plugin?.metadata.id).toBe("fb-group-autojoin-plugin")
  })

  it("should consume candidate queue item, acquire lock lock:${workspaceId}:${accountId}:group_join:${groupId}, and route through pipeline queues", async () => {
    const job: AutomationJob = {
      id: "autojoin-job-1",
      correlationId: "corr-aj-1",
      workspaceId: "ws-aj",
      jobType: "group_autojoin",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const hbf: HumanBehaviourConfig = {
      accountId: "acc-aj",
      timezone: "UTC",
      workingHours: { startHour: 0, endHour: 23 },
      dailyLimits: { group_autojoin: 15 },
      minCooldownMinutes: 5,
      randomDelayRange: { minSeconds: 1, maxSeconds: 5 }
    }

    const candidate: CandidateJoinTask = {
      groupId: "grp-100",
      groupName: "Dhaka Real Estate Forum",
      priorityScore: 85
    }

    const publishedEvents: any[] = []
    eventBus.subscribe("*", async (e) => {
      publishedEvents.push(e)
    })

    const runRes = await coordinator.coordinateAutoJoin(job, "acc-aj", candidate, hbf)

    expect(runRes.success).toBe(true)
    expect(stateMachine.getJobState("autojoin-job-1")).toBe("Completed")

    const timeline = stateMachine.getAuditTimeline("autojoin-job-1")
    expect(timeline.length).toBe(7)
    expect(await queueAdapter.getQueueSize("scheduler")).toBe(1)
    expect(await queueAdapter.getQueueSize("execution")).toBe(1)
    expect(await queueAdapter.getQueueSize("verification")).toBe(1)
    expect(await queueAdapter.getQueueSize("reporting")).toBe(1)

    expect(publishedEvents.length).toBeGreaterThan(0)
    expect(publishedEvents[0].eventVersion).toBe("1.0")
  })
})
