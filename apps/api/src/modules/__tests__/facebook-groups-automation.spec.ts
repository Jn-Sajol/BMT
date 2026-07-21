import { BullMQQueueAdapter } from "../automation-core/infrastructure/bullmq-queue.adapter"
import { GroupAdvancedExecutionStrategy } from "../facebook-groups/application/services/group-execution-strategy.service"
import { TitleVariationService, DescriptionVariationService } from "../facebook-market/application/services/variation.service"
import { AutomationJob } from "../automation-core/domain/automation-core.model"

describe("Facebook Group Auto Poster (F-25 / Client Req #9) Unit Tests", () => {
  let queueAdapter: BullMQQueueAdapter
  let strategy: GroupAdvancedExecutionStrategy
  let titleService: TitleVariationService
  let descService: DescriptionVariationService

  beforeEach(() => {
    queueAdapter = new BullMQQueueAdapter()
    strategy = new GroupAdvancedExecutionStrategy(queueAdapter)
    titleService = new TitleVariationService()
    descService = new DescriptionVariationService()
  })

  it("should submit job to preparation queue and reuse existing AI variation services from market module", async () => {
    const job: AutomationJob = {
      id: "group-job-1",
      correlationId: "corr-group-1",
      workspaceId: "ws-1",
      jobType: "group_post",
      status: "Created",
      payload: {},
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 1. Validate Strategy Enqueue
    const res = await strategy.execute(job)
    expect(res.success).toBe(true)
    expect(await queueAdapter.getQueueSize("preparation")).toBe(1)

    // 2. Validate Reused AI Variations
    const titleVal = await titleService.generate("BMT Group Announcement")
    expect(titleVal).toContain("🔥 NEW:")

    const descVal = await descService.generate("Announcement content body")
    expect(descVal).toContain("✅ Verified Seller")
  })
})
