import { Injectable, NotFoundException } from "@nestjs/common"
import { ConversationInboxRepository } from "../../infrastructure/conversation-inbox.repository"
import { ConversationInbox, ConversationThread, ConversationCategory } from "../../domain/conversation.model"

@Injectable()
export class MessengerInboxService {
  constructor(private readonly conversationInboxRepository: ConversationInboxRepository) {}

  public async getInbox(): Promise<ConversationInbox[]> {
    return this.conversationInboxRepository.findAll()
  }

  public async getInboxById(id: string): Promise<ConversationInbox> {
    const item = await this.conversationInboxRepository.findById(id)
    if (!item) {
      throw new NotFoundException("Conversation Inbox item not found.")
    }
    return item
  }

  public async loadMockConversation(sender: string, text: string, category: ConversationCategory): Promise<ConversationInbox> {
    const item: ConversationInbox = {
      id: `mcon-${Date.now()}`,
      fbPageId: `page-${Date.now()}`,
      fbConversationId: `fbcon-${Date.now()}`,
      senderName: sender,
      lastMessageText: text,
      status: "Pending",
      category,
      createdAt: new Date(),
    }
    await this.conversationInboxRepository.save(item)

    const thread: ConversationThread = {
      id: `mth-${Date.now()}`,
      inboxId: item.id,
      messages: [{ id: "msg-1", sender, text, timestamp: new Date() }],
    }
    await this.conversationInboxRepository.saveThread(thread)
    return item
  }

  public async getThread(inboxId: string): Promise<ConversationThread> {
    const thread = await this.conversationInboxRepository.findThreadByInboxId(inboxId)
    if (!thread) {
      throw new NotFoundException("Messenger thread not found.")
    }
    return thread
  }
}
