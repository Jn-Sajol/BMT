import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from "@nestjs/common"
import { MessengerGroupsSyncService } from "../application/services/messenger-groups-sync.service"
import { MessengerCampaignBuilderService } from "../application/services/messenger-campaign-builder.service"
import { MessengerGroupReportService } from "../application/services/messenger-group-report.service"

@Controller("messenger-groups")
export class MessengerGroupsController {
  constructor(
    private readonly messengerGroupsSyncService: MessengerGroupsSyncService,
    private readonly messengerCampaignBuilderService: MessengerCampaignBuilderService,
    private readonly messengerGroupReportService: MessengerGroupReportService
  ) {}

  @Get()
  public async getGroups() {
    return this.messengerGroupsSyncService.getGroups()
  }

  @Get(":id")
  public async getById(@Param("id") id: string) {
    const group = await this.messengerGroupsSyncService.getGroupById(id)
    if (!group) {
      throw new NotFoundException("Messenger group not found.")
    }
    return group
  }

  @Post("sync")
  public async sync(@Body("accountId") accountId: string) {
    return this.messengerGroupsSyncService.syncMessengerGroups(accountId)
  }

  @Post("campaigns")
  public async createCampaign(
    @Body("title") title: string,
    @Body("groupIds") groupIds: string[],
    @Body("templateId") templateId: string
  ) {
    return this.messengerCampaignBuilderService.createCampaign(title, groupIds, templateId)
  }

  @Put("campaigns/:id")
  public async updateCampaign(@Param("id") id: string, @Body() updates: any) {
    return this.messengerCampaignBuilderService.updateCampaign(id, updates)
  }

  @Delete("campaigns/:id")
  public async deleteCampaign(@Param("id") id: string) {
    await this.messengerCampaignBuilderService.deleteCampaign(id)
    return { success: true }
  }

  @Post("campaigns/:id/schedule")
  public async schedule(@Param("id") id: string, @Body("scheduledAt") scheduledAt: string) {
    const campaign = await this.messengerCampaignBuilderService.scheduleCampaign(id, new Date(scheduledAt))
    await this.messengerGroupReportService.logReport(campaign.id, campaign.title, campaign.groupIds.length, campaign.status)
    return campaign
  }

  @Post("campaigns/:id/cancel")
  public async cancel(@Param("id") id: string) {
    return this.messengerCampaignBuilderService.cancelSchedule(id)
  }

  @Get("history")
  public async getHistory() {
    return this.messengerCampaignBuilderService.getHistory()
  }

  @Get("reports")
  public async getReports() {
    return this.messengerGroupReportService.getReports()
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.messengerGroupsSyncService.getGroups()
    const campaigns = await this.messengerCampaignBuilderService.getCampaigns()
    return {
      totalGroups: list.length,
      totalCampaigns: campaigns.length,
      pendingCampaigns: campaigns.filter((c) => c.status === "Scheduled").length,
      completedCampaigns: campaigns.filter((c) => c.status === "Sent").length,
    }
  }
}
