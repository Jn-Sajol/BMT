import { Module, OnModuleInit } from "@nestjs/common"
import { LinkCommentsController } from "./presentation/link-comments.controller"
import { LinkCommentService } from "./application/services/link-comment.service"
import { KeywordFilterService } from "./application/services/keyword-filter.service"
import { CommentTargetParserService } from "./application/services/comment-target-parser.service"
import { CommentBlockExecutionStrategy } from "./application/services/comment-block-execution-strategy.service"
import { CommentBlockStateMachine } from "./application/services/comment-block-state-machine.service"
import { CommentBlockJobCoordinator } from "./application/services/comment-block-job-coordinator.service"
import { LinkCommentRepository } from "./infrastructure/link-comment.repository"
import { CommentHistoryRepository } from "./infrastructure/comment-history.repository"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { ActionModule } from "../automation/action/action.module"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"

@Module({
  imports: [AutomationCoreModule, ActionModule],
  controllers: [LinkCommentsController],
  providers: [
    LinkCommentService,
    KeywordFilterService,
    CommentTargetParserService,
    CommentBlockExecutionStrategy,
    CommentBlockStateMachine,
    CommentBlockJobCoordinator,
    LinkCommentRepository,
    CommentHistoryRepository,
  ],
  exports: [
    LinkCommentService,
    KeywordFilterService,
    CommentTargetParserService,
    CommentBlockExecutionStrategy,
    CommentBlockStateMachine,
    CommentBlockJobCoordinator,
    LinkCommentRepository,
    CommentHistoryRepository,
  ],
})
export class LinkCommentModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly executionStrategy: CommentBlockExecutionStrategy,
    private readonly jobCoordinator: CommentBlockJobCoordinator
  ) {}

  onModuleInit() {
    const plugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-block-plugin",
        name: "Facebook Comment Block Scraper Foundation",
        version: "1.0.0",
        description: "Parsing and orchestration foundation for Facebook comment block discovery",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.COMMENT_BLOCK_DISCOVERY],
      executionStrategy: this.executionStrategy,
      jobCoordinator: this.jobCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(plugin)
  }
}
