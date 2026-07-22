import { Module, OnModuleInit } from "@nestjs/common"
import { CommentReplyController } from "./presentation/comment-reply.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { CommentReplyInboxService } from "./application/services/comment-reply-inbox.service"
import { CommentInboxService } from "./application/services/comment-inbox.service"
import { ReplyVariationService } from "./application/services/reply-variation.service"
import { ReplySuggestionService } from "./application/services/reply-suggestion.service"
import { ReplyLibraryService } from "./application/services/reply-library.service"
import { ReplyExecutionStrategy } from "./application/services/reply-execution-strategy.service"
import { ReplyStateMachine } from "./application/services/reply-state-machine.service"
import { ReplyJobCoordinator } from "./application/services/reply-job-coordinator.service"
import { CommentReplyExecutionStrategy } from "./application/services/comment-reply-execution-strategy.service"
import { CommentReplyStateMachine } from "./application/services/comment-reply-state-machine.service"
import { CommentReplyJobCoordinator } from "./application/services/comment-reply-job-coordinator.service"
import { CommentInboxRepository } from "./infrastructure/comment-inbox.repository"
import { ReplyTemplateRepository } from "./infrastructure/reply-template.repository"
import { ReplyReportRepository } from "./infrastructure/reply-report.repository"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"

@Module({
  imports: [AutomationCoreModule],
  controllers: [CommentReplyController],
  providers: [
    CommentReplyInboxService,
    CommentInboxService,
    ReplyVariationService,
    ReplySuggestionService,
    ReplyLibraryService,
    ReplyExecutionStrategy,
    ReplyStateMachine,
    ReplyJobCoordinator,
    CommentReplyExecutionStrategy,
    CommentReplyStateMachine,
    CommentReplyJobCoordinator,
    CommentInboxRepository,
    ReplyTemplateRepository,
    ReplyReportRepository,
  ],
  exports: [
    CommentReplyInboxService,
    CommentInboxService,
    ReplyVariationService,
    ReplySuggestionService,
    ReplyLibraryService,
    ReplyExecutionStrategy,
    ReplyStateMachine,
    ReplyJobCoordinator,
    CommentReplyExecutionStrategy,
    CommentReplyStateMachine,
    CommentReplyJobCoordinator,
    CommentInboxRepository,
    ReplyTemplateRepository,
    ReplyReportRepository,
  ],
})
export class CommentReplyModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly replyStrategy: CommentReplyExecutionStrategy,
    private readonly replyCoordinator: CommentReplyJobCoordinator
  ) {}

  onModuleInit() {
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-reply-plugin",
        name: "Facebook AI Reply Comment Assistant Foundation",
        version: "1.0.0",
        description: "Client Requirement #11: AI Reply Comment Assistant Foundation",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.COMMENT_REPLY_ASSISTANT],
      executionStrategy: this.replyStrategy,
      jobCoordinator: this.replyCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(plugin)
  }
}
