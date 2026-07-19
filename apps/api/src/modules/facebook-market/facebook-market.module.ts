import { Module } from "@nestjs/common"
import { FacebookMarketController } from "./presentation/facebook-market.controller"
import { MasterPostService } from "./application/services/master-post.service"
import { SchedulerService } from "./application/services/scheduler.service"
import { PublishingService } from "./application/services/publishing.service"
import { CalendarService } from "./application/services/calendar.service"
import { ReportService } from "./application/services/report.service"
import { PinCommentService } from "./application/services/pin-comment.service"
import { MasterPostRepository } from "./infrastructure/master-post.repository"
import { ScheduleRepository } from "./infrastructure/schedule.repository"
import { PublishRepository } from "./infrastructure/publish.repository"
import { ReportRepository } from "./infrastructure/report.repository"

@Module({
  controllers: [FacebookMarketController],
  providers: [
    MasterPostService,
    SchedulerService,
    PublishingService,
    CalendarService,
    ReportService,
    PinCommentService,
    MasterPostRepository,
    ScheduleRepository,
    PublishRepository,
    ReportRepository,
  ],
  exports: [
    MasterPostService,
    SchedulerService,
    PublishingService,
    CalendarService,
    ReportService,
    PinCommentService,
    MasterPostRepository,
    ScheduleRepository,
    PublishRepository,
    ReportRepository,
  ],
})
export class FacebookMarketModule {}
