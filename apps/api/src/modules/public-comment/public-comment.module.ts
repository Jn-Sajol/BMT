import { Module } from "@nestjs/common"
import { PublicCommentController } from "./presentation/public-comment.controller"
import { CommentCampaignService } from "./application/services/comment-campaign.service"
import { CommentLibraryService } from "./application/services/comment-library.service"
import { CommentReportService } from "./application/services/comment-report.service"
import { CommentCampaignRepository } from "./infrastructure/comment-campaign.repository"
import { CommentTemplateRepository } from "./infrastructure/comment-template.repository"
import { CommentReportRepository } from "./infrastructure/comment-report.repository"

@Module({
  controllers: [PublicCommentController],
  providers: [
    CommentCampaignService,
    CommentLibraryService,
    CommentReportService,
    CommentCampaignRepository,
    CommentTemplateRepository,
    CommentReportRepository,
  ],
  exports: [
    CommentCampaignService,
    CommentLibraryService,
    CommentReportService,
    CommentCampaignRepository,
    CommentTemplateRepository,
    CommentReportRepository,
  ],
})
export class PublicCommentModule {}
