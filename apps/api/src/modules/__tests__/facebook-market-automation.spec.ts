import { TitleVariationService, DescriptionVariationService, CTAService, EmojiVariationService, HashtagService } from "../facebook-market/application/services/variation.service"
import { PostPreparationWorker, SchedulerWorker, VerificationWorker, ReportingWorker } from "../facebook-market/application/services/workers.service"
import { MarketAutomationService } from "../facebook-market/application/services/market-automation.service"

describe("Facebook Market Automation Engine (F-40) Unit Tests", () => {
  let titleService: TitleVariationService
  let descService: DescriptionVariationService
  let ctaService: CTAService
  let emojiService: EmojiVariationService
  let hashtagService: HashtagService

  let prepWorker: PostPreparationWorker
  let schedulerWorker: SchedulerWorker
  let verificationWorker: VerificationWorker
  let reportingWorker: ReportingWorker

  let automationService: MarketAutomationService

  beforeEach(() => {
    titleService = new TitleVariationService()
    descService = new DescriptionVariationService()
    ctaService = new CTAService()
    emojiService = new EmojiVariationService()
    hashtagService = new HashtagService()

    prepWorker = new PostPreparationWorker()
    schedulerWorker = new SchedulerWorker()
    verificationWorker = new VerificationWorker()
    reportingWorker = new ReportingWorker()

    automationService = new MarketAutomationService(prepWorker, schedulerWorker, verificationWorker, reportingWorker)
  })

  it("should generate AI listing details, calculate paced delays, and track worker jobs", async () => {
    // 1. AI Variation Generators
    const titleVal = await titleService.generate("iPhone 13")
    expect(titleVal).toContain("🔥 NEW:")

    const descVal = await descService.generate("Like new condition")
    expect(descVal).toContain("✅ Verified Seller")

    const ctaVal = await ctaService.generate()
    expect(ctaVal).toBe("DM now to secure yours before it sells out!")

    const emojiVal = await emojiService.generate("Bike")
    expect(emojiVal).toContain("✨ 📦")

    const hashes = await hashtagService.generate(["Sale", "Deals"])
    expect(hashes).toEqual(["#sale", "#deals"])

    // 2. Scheduler Delay Calculations
    const delay = await schedulerWorker.calculateDelay("job-1", 10)
    expect(delay).toBeGreaterThanOrEqual(600) // 10 minutes = 600s

    // 3. Execution Pipeline run
    const result = await automationService.startAutomation("Automation run 1", { payloadDetails: true })
    expect(result.status).toBe("Completed")
    expect(result.publishedUrl).toContain("facebook.com")

    const active = await automationService.getReports()
    expect(active.length).toBe(1)
  })
})
