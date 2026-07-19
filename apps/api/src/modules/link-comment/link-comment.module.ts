import { Module } from "@nestjs/common"
import { LinkCommentsController } from "./presentation/link-comments.controller"
import { LinkCommentService } from "./application/services/link-comment.service"
import { KeywordFilterService } from "./application/services/keyword-filter.service"
import { LinkCommentRepository } from "./infrastructure/link-comment.repository"
import { CommentHistoryRepository } from "./infrastructure/comment-history.repository"

@Module({
  controllers: [LinkCommentsController],
  providers: [
    LinkCommentService,
    KeywordFilterService,
    LinkCommentRepository,
    CommentHistoryRepository,
  ],
  exports: [
    LinkCommentService,
    KeywordFilterService,
    LinkCommentRepository,
    CommentHistoryRepository,
  ],
})
export class LinkCommentModule {}
