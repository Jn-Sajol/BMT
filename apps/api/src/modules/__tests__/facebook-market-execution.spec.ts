import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { MarketAdvancedExecutionStrategy } from "../facebook-market/application/services/execution-strategy.service"
import { MarketStateMachineService } from "../facebook-market/application/services/state-machine.service"
import { AutomationJob } from "../automation-core/domain/automation-core.model"

describe("Facebook Market Automation Execution (F-41) Unit Tests", () => {
  let queueAdapter: BullMQQueueAdapter
  let strategy: MarketAdvancedExecutionStrategy
  let stateMachine: MarketStateMachineService

  beforeEach(() => {
    queueAdapter = new BullMQQueueAdapter()
    strategy = new MarketAdvancedExecutionStrategy(queueAdapter)
    stateMachine = new MarketStateMachineService()
  })

  it("should submit job to preparation queue and track the state machine progression with audit logs", async () => {
    const job: AutomationJob = {
      id: "exec-job-1",
      correlationId: "corr-exec-1",
      workspaceId: "ws-1",
      jobType: "market_list",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 1. Test Strategy Enqueue
    const res = await strategy.execute(job)
    expect(res.success).toBe(true)
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)

    // 2. Test State Machine transitions
    await stateMachine.transition("exec-job-1", "Prepared", "Preparation stage completed.")
    await stateMachine.transition("exec-job-1", "Waiting", "Awaiting target pacing delay.")
    await stateMachine.transition("exec-job-1", "Running", "Playwright context is active.")
    await stateMachine.transition("exec-job-1", "Verifying", "Publish verification started.")
    await stateMachine.transition("exec-job-1", "Completed", "Successfully published to Marketplace.")

    expect(stateMachine.getJobState("exec-job-1")).toBe("Completed")

    // Check logs trace
    const logs = stateMachine.getAuditTimeline("exec-job-1")
    expect(logs.length).toBe(5)
    expect(logs[0].toState).toBe("Prepared")
    expect(logs[4].toState).toBe("Completed")
  })
})
