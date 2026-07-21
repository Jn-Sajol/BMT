import { Module } from "@nestjs/common"
import { PublicCommentController } from "./presentation/public-comment.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { CommentCampaignService } from "./application/services/comment-campaign.service"
import { CommentLibraryService } from "./application/services/comment-library.service"
import { CommentReportService } from "./application/services/comment-report.service"
import { CommentExecutionStrategy } from "./application/services/comment-execution-strategy.service"
import { CommentStateMachine } from "./application/services/comment-state-machine.service"
import { CommentJobCoordinator } from "./application/services/comment-job-coordinator.service"
import { CommentCampaignRepository } from "./infrastructure/comment-campaign.repository"
import { CommentTemplateRepository } from "./infrastructure/comment-template.repository"
import { CommentReportRepository } from "./infrastructure/comment-report.repository"

@Module({
  imports: [AutomationCoreModule],
  controllers: [PublicCommentController],
  providers: [
    CommentCampaignService,
    CommentLibraryService,
    CommentReportService,
    CommentExecutionStrategy,
    CommentStateMachine,
    CommentJobCoordinator,
    CommentCampaignRepository,
    CommentTemplateRepository,
    CommentReportRepository,
  ],
  exports: [
    CommentCampaignService,
    CommentLibraryService,
    CommentReportService,
    CommentExecutionStrategy,
    CommentStateMachine,
    CommentJobCoordinator,
    CommentCampaignRepository,
    CommentTemplateRepository,
    CommentReportRepository,
  ],
})
export class PublicCommentModule {}
