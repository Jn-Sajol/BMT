import { Module, OnModuleInit } from "@nestjs/common"
import { MessengerControllerController } from "./presentation/messenger-controller.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { MessengerInboxService } from "./application/services/messenger-inbox.service"
import { ConversationClassificationService } from "./application/services/conversation-classification.service"
import { MessengerSuggestionService } from "./application/services/messenger-suggestion.service"
import { MessageLibraryService } from "./application/services/message-library.service"
import { MessengerExecutionStrategy } from "./application/services/messenger-execution-strategy.service"
import { MessengerStateMachine } from "./application/services/messenger-state-machine.service"
import { MessengerJobCoordinator } from "./application/services/messenger-job-coordinator.service"
import { MessengerInboxExecutionStrategy } from "./application/services/messenger-inbox-execution-strategy.service"
import { MessengerInboxStateMachine } from "./application/services/messenger-inbox-state-machine.service"
import { MessengerInboxJobCoordinator } from "./application/services/messenger-inbox-job-coordinator.service"
import { MessengerReplySuggestionService } from "./application/services/messenger-reply-suggestion.service"
import { MessengerManualApprovalService } from "./application/services/messenger-manual-approval.service"
import { MessengerReplyLibraryService } from "./application/services/messenger-reply-library.service"
import { MessengerManualReplyExecutionStrategy } from "./application/services/messenger-manual-reply-execution-strategy.service"
import { MessengerManualReplyStateMachine } from "./application/services/messenger-manual-reply-state-machine.service"
import { MessengerManualReplyJobCoordinator } from "./application/services/messenger-manual-reply-job-coordinator.service"
import { ConversationInboxRepository } from "./infrastructure/conversation-inbox.repository"
import { MessageTemplateRepository } from "./infrastructure/message-template.repository"
import { ConversationReportRepository } from "./infrastructure/conversation-report.repository"
import { AutomationRegistryService } from "../automation-core/application/services/automation-registry.service"
import { FacebookDriver } from "../automation-core/domain/facebook-driver"
import { AutomationCapability, AutomationPlugin } from "../automation-core/domain/automation-plugin.model"

@Module({
  imports: [AutomationCoreModule],
  controllers: [MessengerControllerController],
  providers: [
    MessengerInboxService,
    ConversationClassificationService,
    MessengerSuggestionService,
    MessageLibraryService,
    MessengerExecutionStrategy,
    MessengerStateMachine,
    MessengerJobCoordinator,
    MessengerInboxExecutionStrategy,
    MessengerInboxStateMachine,
    MessengerInboxJobCoordinator,
    MessengerReplySuggestionService,
    MessengerManualApprovalService,
    MessengerReplyLibraryService,
    MessengerManualReplyExecutionStrategy,
    MessengerManualReplyStateMachine,
    MessengerManualReplyJobCoordinator,
    ConversationInboxRepository,
    MessageTemplateRepository,
    ConversationReportRepository,
  ],
  exports: [
    MessengerInboxService,
    ConversationClassificationService,
    MessengerSuggestionService,
    MessageLibraryService,
    MessengerExecutionStrategy,
    MessengerStateMachine,
    MessengerJobCoordinator,
    MessengerInboxExecutionStrategy,
    MessengerInboxStateMachine,
    MessengerInboxJobCoordinator,
    MessengerReplySuggestionService,
    MessengerManualApprovalService,
    MessengerReplyLibraryService,
    MessengerManualReplyExecutionStrategy,
    MessengerManualReplyStateMachine,
    MessengerManualReplyJobCoordinator,
    ConversationInboxRepository,
    MessageTemplateRepository,
    ConversationReportRepository,
  ],
})
export class MessengerControllerModule implements OnModuleInit {
  constructor(
    private readonly registryService: AutomationRegistryService,
    private readonly facebookDriver: FacebookDriver,
    private readonly inboxStrategy: MessengerInboxExecutionStrategy,
    private readonly inboxCoordinator: MessengerInboxJobCoordinator,
    private readonly manualStrategy: MessengerManualReplyExecutionStrategy,
    private readonly manualCoordinator: MessengerManualReplyJobCoordinator
  ) {}

  onModuleInit() {
    const inboxPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-inbox-plugin",
        name: "Facebook Messenger Inbox Controller Foundation",
        version: "1.0.0",
        description: "Client Requirement #12: Messenger Inbox Orchestration Foundation",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_INBOX],
      executionStrategy: this.inboxStrategy,
      jobCoordinator: this.inboxCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    const manualPlugin: AutomationPlugin = {
      metadata: {
        id: "fb-messenger-manual-reply-plugin",
        name: "Facebook Messenger Manual Reply Assistant",
        version: "1.0.0",
        description: "Client Requirement #12: Messenger Controller Manual Reply Assistant",
        platform: "facebook"
      },
      driver: this.facebookDriver,
      capabilities: [AutomationCapability.MESSENGER_MANUAL_REPLY],
      executionStrategy: this.manualStrategy,
      jobCoordinator: this.manualCoordinator,
      isEnabled: true,
      verify: async () => ({ status: "Success", verifiedAt: new Date() }),
      report: async () => {}
    }

    this.registryService.registerPlugin(inboxPlugin)
    this.registryService.registerPlugin(manualPlugin)
  }
}
