import { Module } from "@nestjs/common"
import { MessengerGroupsController } from "./presentation/messenger-groups.controller"
import { MessengerGroupsSyncService } from "./application/services/messenger-groups-sync.service"
import { MessengerCampaignBuilderService } from "./application/services/messenger-campaign-builder.service"
import { MessengerGroupReportService } from "./application/services/messenger-group-report.service"
import { MessengerGroupRepository } from "./infrastructure/messenger-group.repository"
import { MessengerCampaignRepository } from "./infrastructure/messenger-campaign.repository"
import { CampaignReportRepository } from "./infrastructure/campaign-report.repository"

@Module({
  controllers: [MessengerGroupsController],
  providers: [
    MessengerGroupsSyncService,
    MessengerCampaignBuilderService,
    MessengerGroupReportService,
    MessengerGroupRepository,
    MessengerCampaignRepository,
    CampaignReportRepository,
  ],
  exports: [
    MessengerGroupsSyncService,
    MessengerCampaignBuilderService,
    MessengerGroupReportService,
    MessengerGroupRepository,
    MessengerCampaignRepository,
    CampaignReportRepository,
  ],
})
export class MessengerGroupsModule {}
