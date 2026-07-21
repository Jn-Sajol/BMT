import { Module } from "@nestjs/common"
import { MessengerControllerController } from "./presentation/messenger-controller.controller"
import { AutomationCoreModule } from "../automation-core/automation-core.module"
import { MessengerInboxService } from "./application/services/messenger-inbox.service"
import { MessengerSuggestionService } from "./application/services/messenger-suggestion.service"
import { MessageLibraryService } from "./application/services/message-library.service"
import { MessengerExecutionStrategy } from "./application/services/messenger-execution-strategy.service"
import { MessengerStateMachine } from "./application/services/messenger-state-machine.service"
import { MessengerJobCoordinator } from "./application/services/messenger-job-coordinator.service"
import { ConversationInboxRepository } from "./infrastructure/conversation-inbox.repository"
import { MessageTemplateRepository } from "./infrastructure/message-template.repository"
import { ConversationReportRepository } from "./infrastructure/conversation-report.repository"

@Module({
  imports: [AutomationCoreModule],
  controllers: [MessengerControllerController],
  providers: [
    MessengerInboxService,
    MessengerSuggestionService,
    MessageLibraryService,
    MessengerExecutionStrategy,
    MessengerStateMachine,
    MessengerJobCoordinator,
    ConversationInboxRepository,
    MessageTemplateRepository,
    ConversationReportRepository,
  ],
  exports: [
    MessengerInboxService,
    MessengerSuggestionService,
    MessageLibraryService,
    MessengerExecutionStrategy,
    MessengerStateMachine,
    MessengerJobCoordinator,
    ConversationInboxRepository,
    MessageTemplateRepository,
    ConversationReportRepository,
  ],
})
export class MessengerControllerModule {}
