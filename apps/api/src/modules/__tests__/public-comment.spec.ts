import { CommentCampaignRepository } from "../public-comment/infrastructure/comment-campaign.repository"
import { CommentCampaignService } from "../public-comment/application/services/comment-campaign.service"
import { CommentTemplateRepository } from "../public-comment/infrastructure/comment-template.repository"
import { CommentLibraryService } from "../public-comment/application/services/comment-library.service"
import { CommentReportRepository } from "../public-comment/infrastructure/comment-report.repository"
import { CommentReportService } from "../public-comment/application/services/comment-report.service"
import { PublicCommentController } from "../public-comment/presentation/public-comment.controller"

describe("Public Comment Assistant (F-26) Unit Tests", () => {
  it("should create campaign, duplicate it, configure templates library, and fetch statistics", async () => {
    const campaignRepo = new CommentCampaignRepository()
    const templateRepo = new CommentTemplateRepository()
    const reportRepo = new CommentReportRepository()

    const campaignService = new CommentCampaignService(campaignRepo)
    const libraryService = new CommentLibraryService(templateRepo)
    const reportService = new CommentReportService(reportRepo)

    const controller = new PublicCommentController(campaignService, libraryService, reportService)

    // 1. Create Campaign
    const campaign = await controller.createCampaign(
      "Black Friday Strategy",
      "US",
      "E-commerce",
      "deals",
      ["discount", "sales"],
      20,
      "09:00-17:00",
      ["profile-1", "profile-2"]
    )
    expect(campaign.status).toBe("Draft")
    expect(campaign.title).toBe("Black Friday Strategy")

    // 2. Duplicate Campaign
    const duplicate = await controller.duplicateCampaign(campaign.id)
    expect(duplicate.title).toContain("Copy")

    // 3. Comment Template Library CRUD
    const template = await controller.addTemplate("Super nice discount!", "Promo", ["sale", "off"], "en", "admin")
    expect(template.content).toBe("Super nice discount!")

    const updated = await controller.updateTemplate(template.id, { content: "Get 20% off today!" })
    expect(updated.content).toBe("Get 20% off today!")

    const listTemplates = await controller.getTemplates()
    expect(listTemplates.length).toBe(1)

    // 4. Statistics
    const stats = await controller.getStatistics()
    expect(stats.totalCampaigns).toBe(2)
    expect(stats.totalTemplates).toBe(1)

    // 5. Delete Template
    await controller.deleteTemplate(template.id)
    const afterDelete = await controller.getTemplates()
    expect(afterDelete.length).toBe(0)
  })
})
