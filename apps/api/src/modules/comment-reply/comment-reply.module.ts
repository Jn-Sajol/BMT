import { Module } from "@nestjs/common"
import { CommentReplyController } from "./presentation/comment-reply.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { CommentReplyInboxService } from "./application/services/comment-reply-inbox.service"
import { ReplySuggestionService } from "./application/services/reply-suggestion.service"
import { ReplyLibraryService } from "./application/services/reply-library.service"
import { ReplyExecutionStrategy } from "./application/services/reply-execution-strategy.service"
import { ReplyStateMachine } from "./application/services/reply-state-machine.service"
import { ReplyJobCoordinator } from "./application/services/reply-job-coordinator.service"
import { CommentInboxRepository } from "./infrastructure/comment-inbox.repository"
import { ReplyTemplateRepository } from "./infrastructure/reply-template.repository"
import { ReplyReportRepository } from "./infrastructure/reply-report.repository"

@Module({
  imports: [AutomationCoreModule],
  controllers: [CommentReplyController],
  providers: [
    CommentReplyInboxService,
    ReplySuggestionService,
    ReplyLibraryService,
    ReplyExecutionStrategy,
    ReplyStateMachine,
    ReplyJobCoordinator,
    CommentInboxRepository,
    ReplyTemplateRepository,
    ReplyReportRepository,
  ],
  exports: [
    CommentReplyInboxService,
    ReplySuggestionService,
    ReplyLibraryService,
    ReplyExecutionStrategy,
    ReplyStateMachine,
    ReplyJobCoordinator,
    CommentInboxRepository,
    ReplyTemplateRepository,
    ReplyReportRepository,
  ],
})
export class CommentReplyModule {}
