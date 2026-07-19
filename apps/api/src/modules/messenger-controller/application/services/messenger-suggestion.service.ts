import { Injectable, NotFoundException } from "@nestjs/common"
import { ConversationInboxRepository } from "../../infrastructure/conversation-inbox.repository"
import { ReplyHistory } from "../../domain/conversation.model"

@Injectable()
export class MessengerSuggestionService {
  constructor(private readonly conversationInboxRepository: ConversationInboxRepository) {}

  public async generateSuggestions(inboxId: string): Promise<string[]> {
    console.log(`[MessengerSuggestionService] Querying AI Copilot suggestions for messenger conversation: ${inboxId}...`)
    return [
      "Hello! How can we help you today with your order?",
      "Hi there! The visit slots are available tomorrow.",
      "Greetings! We have forwarded your request to sales.",
    ]
  }

  public async approveAndReply(
    inboxId: string,
    originalText: string,
    replyText: string,
    user: string
  ): Promise<ReplyHistory> {
    const item = await this.conversationInboxRepository.findById(inboxId)
    if (!item) {
      throw new NotFoundException("Conversation inbox item not found to reply.")
    }
    item.status = "Replied"
    await this.conversationInboxRepository.save(item)

    const history: ReplyHistory = {
      id: `mrh-${Date.now()}`,
      inboxId,
      originalMessage: originalText,
      selectedSuggestion: replyText,
      editedMessage: replyText,
      user,
      timestamp: new Date(),
    }
    return this.conversationInboxRepository.saveHistory(history)
  }

  public async getHistory(): Promise<ReplyHistory[]> {
    return this.conversationInboxRepository.getHistory()
  }
}
