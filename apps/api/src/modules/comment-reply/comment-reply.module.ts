import { Module } from "@nestjs/common"
import { CommentReplyController } from "./presentation/comment-reply.controller"
import { CommentReplyInboxService } from "./application/services/comment-reply-inbox.service"
import { ReplySuggestionService } from "./application/services/reply-suggestion.service"
import { ReplyLibraryService } from "./application/services/reply-library.service"
import { CommentInboxRepository } from "./infrastructure/comment-inbox.repository"
import { ReplyTemplateRepository } from "./infrastructure/reply-template.repository"
import { ReplyReportRepository } from "./infrastructure/reply-report.repository"

@Module({
  controllers: [CommentReplyController],
  providers: [
    CommentReplyInboxService,
    ReplySuggestionService,
    ReplyLibraryService,
    CommentInboxRepository,
    ReplyTemplateRepository,
    ReplyReportRepository,
  ],
  exports: [
    CommentReplyInboxService,
    ReplySuggestionService,
    ReplyLibraryService,
    CommentInboxRepository,
    ReplyTemplateRepository,
    ReplyReportRepository,
  ],
})
export class CommentReplyModule {}
