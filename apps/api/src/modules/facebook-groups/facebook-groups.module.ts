import { Module } from "@nestjs/common"
import { FacebookGroupsController } from "./presentation/facebook-groups.controller"
import { FacebookGroupsSyncService } from "./application/services/facebook-groups-sync.service"
import { GroupSchedulerService } from "./application/services/group-scheduler.service"
import { GroupPublishingService } from "./application/services/group-publishing.service"
import { FacebookGroupRepository } from "./infrastructure/facebook-group.repository"
import { GroupScheduleRepository } from "./infrastructure/group-schedule.repository"
import { GroupPublishRepository } from "./infrastructure/group-publish.repository"

@Module({
  controllers: [FacebookGroupsController],
  providers: [
    FacebookGroupsSyncService,
    GroupSchedulerService,
    GroupPublishingService,
    FacebookGroupRepository,
    GroupScheduleRepository,
    GroupPublishRepository,
  ],
  exports: [
    FacebookGroupsSyncService,
    GroupSchedulerService,
    GroupPublishingService,
    FacebookGroupRepository,
    GroupScheduleRepository,
    GroupPublishRepository,
  ],
})
export class FacebookGroupsModule {}
