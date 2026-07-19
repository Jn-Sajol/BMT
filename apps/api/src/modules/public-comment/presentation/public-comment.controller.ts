import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common"
import { CommentCampaignService } from "../application/services/comment-campaign.service"
import { CommentLibraryService } from "../application/services/comment-library.service"
import { CommentReportService } from "../application/services/comment-report.service"

@Controller("public-comment")
export class PublicCommentController {
  constructor(
    private readonly commentCampaignService: CommentCampaignService,
    private readonly commentLibraryService: CommentLibraryService,
    private readonly commentReportService: CommentReportService
  ) {}

  @Get("campaigns")
  public async getCampaigns() {
    return this.commentCampaignService.getCampaigns()
  }

  @Post("campaigns")
  public async createCampaign(
    @Body("title") title: string,
    @Body("country") country: string,
    @Body("category") category: string,
    @Body("niche") niche: string,
    @Body("keywords") keywords: string[],
    @Body("dailyLimit") dailyLimit: number,
    @Body("executionWindow") executionWindow: string,
    @Body("accountTargets") accountTargets: string[]
  ) {
    const campaign = await this.commentCampaignService.createCampaign(
      title,
      country,
      category,
      niche,
      keywords,
      dailyLimit,
      executionWindow,
      accountTargets
    )
    // Log initial report
    await this.commentReportService.generateSummaryReport(campaign.id, campaign.title, campaign.status, 0, accountTargets.length)
    return campaign
  }

  @Put("campaigns/:id")
  public async updateCampaign(@Param("id") id: string, @Body() updates: any) {
    return this.commentCampaignService.updateCampaign(id, updates)
  }

  @Delete("campaigns/:id")
  public async deleteCampaign(@Param("id") id: string) {
    await this.commentCampaignService.deleteCampaign(id)
    return { success: true }
  }

  @Post("campaigns/:id/duplicate")
  public async duplicateCampaign(@Param("id") id: string) {
    return this.commentCampaignService.duplicateCampaign(id)
  }

  @Get("templates")
  public async getTemplates() {
    return this.commentLibraryService.getTemplates()
  }

  @Post("templates")
  public async addTemplate(
    @Body("content") content: string,
    @Body("category") category: string,
    @Body("tags") tags: string[],
    @Body("language") language: string,
    @Body("createdBy") createdBy: string
  ) {
    return this.commentLibraryService.addTemplate(content, category, tags, language, createdBy)
  }

  @Put("templates/:id")
  public async updateTemplate(@Param("id") id: string, @Body() updates: any) {
    return this.commentLibraryService.updateTemplate(id, updates)
  }

  @Delete("templates/:id")
  public async deleteTemplate(@Param("id") id: string) {
    await this.commentLibraryService.deleteTemplate(id)
    return { success: true }
  }

  @Get("reports")
  public async getReports() {
    return this.commentReportService.getReports()
  }

  @Get("statistics")
  public async getStatistics() {
    const campaigns = await this.commentCampaignService.getCampaigns()
    const templates = await this.commentLibraryService.getTemplates()
    return {
      totalCampaigns: campaigns.length,
      draftCampaigns: campaigns.filter((c) => c.status === "Draft").length,
      activeCampaigns: campaigns.filter((c) => c.status === "Active").length,
      totalTemplates: templates.length,
    }
  }
}
