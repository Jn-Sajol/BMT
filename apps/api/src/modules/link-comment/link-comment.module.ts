import { Module, OnModuleInit } from "@nestjs/common"
import { LinkCommentsController } from "./presentation/link-comments.controller"
import { LinkCommentService } from "./application/services/link-comment.service"
import { KeywordFilterService } from "./application/services/keyword-filter.service"
import { CommentTargetParserService } from "./application/services/comment-target-parser.service"
import { CommentBlockExecutionStrategy } from "./application/services/comment-block-execution-strategy.service"
import { CommentBlockStateMachine } from "./application/services/comment-block-state-machine.service"
import { CommentBlockJobCoordinator } from "./application/services/comment-block-job-coordinator.service"
import { CommentCollectionExecutionStrategy } from "./application/services/comment-collection-execution-strategy.service"
import { CommentCollectionStateMachine } from "./application/services/comment-collection-state-machine.service"
import { CommentCollectionJobCoordinator } from "./application/services/comment-collection-job-coordinator.service"
import { CommentProcessingService } from "./application/services/comment-processing.service"
import { LeadScoreService } from "./application/services/lead-score.service"
import { LeadCandidateBuilder } from "./application/services/lead-candidate-builder.service"
import { CommentProcessingExecutionStrategy } from "./application/services/comment-processing-execution-strategy.service"
import { CommentProcessingStateMachine } from "./application/services/comment-processing-state-machine.service"
import { CommentProcessingJobCoordinator } from "./application/services/comment-processing-job-coordinator.service"
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
    CommentCollectionExecutionStrategy,
    CommentCollectionStateMachine,
    CommentCollectionJobCoordinator,
    CommentProcessingService,
    LeadScoreService,
    LeadCandidateBuilder,
    CommentProcessingExecutionStrategy,
    CommentProcessingStateMachine,
    CommentProcessingJobCoordinator,
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
    CommentCollectionExecutionStrategy,
    CommentCollectionStateMachine,
    CommentCollectionJobCoordinator,
    CommentProcessingService,
    LeadScoreService,
    LeadCandidateBuilder,
    CommentProcessingExecutionStrategy,
    CommentProcessingStateMachine,
    CommentProcessingJobCoordinator,
    LinkCommentRepository,
    CommentHistoryRepository,
  ],
})
export class LinkCommentModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly blockStrategy: CommentBlockExecutionStrategy,
    private readonly blockCoordinator: CommentBlockJobCoordinator,
    private readonly collectionStrategy: CommentCollectionExecutionStrategy,
    private readonly collectionCoordinator: CommentCollectionJobCoordinator,
    private readonly processingStrategy: CommentProcessingExecutionStrategy,
    private readonly processingCoordinator: CommentProcessingJobCoordinator
  ) {}

  onModuleInit() {
    const blockPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-block-plugin",
        name: "Facebook Comment Block Scraper Foundation",
        version: "1.0.0",
        description: "Parsing and orchestration foundation for Facebook comment block discovery",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.COMMENT_BLOCK_DISCOVERY],
      executionStrategy: this.blockStrategy,
      jobCoordinator: this.blockCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    const collectionPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-collection-plugin",
        name: "Facebook Comment Collection Orchestration",
        version: "1.0.0",
        description: "Execution orchestration pipeline for Facebook comment collection",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.COMMENT_COLLECTION],
      executionStrategy: this.collectionStrategy,
      jobCoordinator: this.collectionCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    const processingPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-comment-processing-plugin",
        name: "Facebook Comment Processing & Lead Extraction Foundation",
        version: "1.0.0",
        description: "Processing and AI lead extraction foundation for Facebook comment batches",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.COMMENT_PROCESSING],
      executionStrategy: this.processingStrategy,
      jobCoordinator: this.processingCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(blockPlugin)
    this.registryService.registerPlugin(collectionPlugin)
    this.registryService.registerPlugin(processingPlugin)
  }
}
