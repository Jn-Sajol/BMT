import { Module } from "@nestjs/common"
import { MessengerControllerController } from "./presentation/messenger-controller.controller"
import { MessengerInboxService } from "./application/services/messenger-inbox.service"
import { MessengerSuggestionService } from "./application/services/messenger-suggestion.service"
import { MessageLibraryService } from "./application/services/message-library.service"
import { ConversationInboxRepository } from "./infrastructure/conversation-inbox.repository"
import { MessageTemplateRepository } from "./infrastructure/message-template.repository"
import { ConversationReportRepository } from "./infrastructure/conversation-report.repository"

@Module({
  controllers: [MessengerControllerController],
  providers: [
    MessengerInboxService,
    MessengerSuggestionService,
    MessageLibraryService,
    ConversationInboxRepository,
    MessageTemplateRepository,
    ConversationReportRepository,
  ],
  exports: [
    MessengerInboxService,
    MessengerSuggestionService,
    MessageLibraryService,
    ConversationInboxRepository,
    MessageTemplateRepository,
    ConversationReportRepository,
  ],
})
export class MessengerControllerModule {}
