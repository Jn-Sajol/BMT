import { Module } from "@nestjs/common"
import { FacebookGroupsController } from "./presentation/facebook-groups.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { FacebookGroupsSyncService } from "./application/services/facebook-groups-sync.service"
import { GroupSchedulerService } from "./application/services/group-scheduler.service"
import { GroupPublishingService } from "./application/services/group-publishing.service"
import { GroupAdvancedExecutionStrategy } from "./application/services/group-execution-strategy.service"
import { FacebookGroupRepository } from "./infrastructure/facebook-group.repository"
import { GroupScheduleRepository } from "./infrastructure/group-schedule.repository"
import { GroupPublishRepository } from "./infrastructure/group-publish.repository"

@Module({
  imports: [AutomationCoreModule],
  controllers: [FacebookGroupsController],
  providers: [
    FacebookGroupsSyncService,
    GroupSchedulerService,
    GroupPublishingService,
    GroupAdvancedExecutionStrategy,
    FacebookGroupRepository,
    GroupScheduleRepository,
    GroupPublishRepository,
  ],
  exports: [
    FacebookGroupsSyncService,
    GroupSchedulerService,
    GroupPublishingService,
    GroupAdvancedExecutionStrategy,
    FacebookGroupRepository,
    GroupScheduleRepository,
    GroupPublishRepository,
  ],
})
export class FacebookGroupsModule {}
