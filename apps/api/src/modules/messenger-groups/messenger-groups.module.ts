import { Module } from "@nestjs/common"
import { MessengerGroupsController } from "./presentation/messenger-groups.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { MessengerGroupsSyncService } from "./application/services/messenger-groups-sync.service"
import { MessengerCampaignBuilderService } from "./application/services/messenger-campaign-builder.service"
import { MessengerGroupReportService } from "./application/services/messenger-group-report.service"
import { GroupMessengerExecutionStrategy } from "./application/services/group-messenger-execution-strategy.service"
import { GroupMessengerStateMachine } from "./application/services/group-messenger-state-machine.service"
import { GroupMessengerJobCoordinator } from "./application/services/group-messenger-job-coordinator.service"
import { MessengerGroupRepository } from "./infrastructure/messenger-group.repository"
import { MessengerCampaignRepository } from "./infrastructure/messenger-campaign.repository"
import { CampaignReportRepository } from "./infrastructure/campaign-report.repository"

@Module({
  imports: [AutomationCoreModule],
  controllers: [MessengerGroupsController],
  providers: [
    MessengerGroupsSyncService,
    MessengerCampaignBuilderService,
    MessengerGroupReportService,
    GroupMessengerExecutionStrategy,
    GroupMessengerStateMachine,
    GroupMessengerJobCoordinator,
    MessengerGroupRepository,
    MessengerCampaignRepository,
    CampaignReportRepository,
  ],
  exports: [
    MessengerGroupsSyncService,
    MessengerCampaignBuilderService,
    MessengerGroupReportService,
    GroupMessengerExecutionStrategy,
    GroupMessengerStateMachine,
    GroupMessengerJobCoordinator,
    MessengerGroupRepository,
    MessengerCampaignRepository,
    CampaignReportRepository,
  ],
})
export class MessengerGroupsModule {}
