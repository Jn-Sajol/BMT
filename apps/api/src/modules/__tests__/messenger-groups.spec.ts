import { MessengerGroupRepository } from "../messenger-groups/infrastructure/messenger-group.repository"
import { MessengerGroupsSyncService } from "../messenger-groups/application/services/messenger-groups-sync.service"
import { MessengerCampaignRepository } from "../messenger-groups/infrastructure/messenger-campaign.repository"
import { MessengerCampaignBuilderService } from "../messenger-groups/application/services/messenger-campaign-builder.service"
import { CampaignReportRepository } from "../messenger-groups/infrastructure/campaign-report.repository"
import { MessengerGroupReportService } from "../messenger-groups/application/services/messenger-group-report.service"
import { MessengerGroupsController } from "../messenger-groups/presentation/messenger-groups.controller"

describe("Messenger Group Assistant (F-29) Unit Tests", () => {
  it("should sync messenger groups, create campaigns, schedule, cancel, and pull statistics reports", async () => {
    const groupRepo = new MessengerGroupRepository()
    const campaignRepo = new MessengerCampaignRepository()
    const reportRepo = new CampaignReportRepository()

    const syncService = new MessengerGroupsSyncService(groupRepo)
    const builderService = new MessengerCampaignBuilderService(campaignRepo)
    const reportService = new MessengerGroupReportService(reportRepo)

    const controller = new MessengerGroupsController(syncService, builderService, reportService)

    // 1. Sync messenger groups
    const synced = await controller.sync("acc-profile-1")
    expect(synced.length).toBe(2)
    expect(synced[0].name).toBe("BMT Premium Support Chat")

    const list = await controller.getGroups()
    expect(list.length).toBe(2)

    // 2. Create Campaign
    const campaign = await controller.createCampaign("Holiday Promo Blast", [synced[0].id], "temp-welcome")
    expect(campaign.status).toBe("Draft")
    expect(campaign.title).toBe("Holiday Promo Blast")

    // 3. Schedule Campaign
    const scheduleTime = new Date(Date.now() + 3600000).toISOString()
    const scheduled = await controller.schedule(campaign.id, scheduleTime)
    expect(scheduled.status).toBe("Scheduled")

    // 4. Cancel Schedule
    const cancelled = await controller.cancel(campaign.id)
    expect(cancelled.status).toBe("Cancelled")

    // 5. Manual dispatch execution history
    const sentHistory = await builderService.executeManualSend(campaign.id, "operator-1")
    expect(sentHistory.status).toBe("success")

    const historyList = await controller.getHistory()
    expect(historyList.length).toBe(1)

    const stats = await controller.getStatistics()
    expect(stats.totalGroups).toBe(2)
    expect(stats.totalCampaigns).toBe(1)
  })
})
