import { Injectable } from "@nestjs/common"

export interface NormalizedMessengerConversation {
  conversationId: string
  pageId: string
  accountId: string
  senderId: string
  senderName: string
  lastMessageText: string
  lastMessageTimestamp: Date
  unreadCount: number
  isRead: boolean
  metadata: Record<string, any>
}

export interface GroupedPageInbox {
  pageId: string
  accountId: string
  totalConversations: number
  unreadConversationsCount: number
  conversations: NormalizedMessengerConversation[]
}

export interface InboxQueueItem {
  id: string
  conversationId: string
  pageId: string
  accountId: string
  senderName: string
  lastMessageText: string
  unreadCount: number
  enqueuedAt: Date
}

import { ConversationInboxRepository } from "../../infrastructure/conversation-inbox.repository"

@Injectable()
export class MessengerInboxService {
  private conversationStore: Map<string, NormalizedMessengerConversation> = new Map()
  private processedMessageIds: Set<string> = new Set()

  constructor(private readonly conversationInboxRepository?: ConversationInboxRepository) {}

  public async loadMockConversation(sender: string, text: string, category: any): Promise<any> {
    const item = {
      id: `mcon-${Date.now()}`,
      fbPageId: `page-${Date.now()}`,
      fbConversationId: `fbcon-${Date.now()}`,
      senderName: sender,
      lastMessageText: text,
      status: "Pending",
      category,
      createdAt: new Date(),
    }
    if (this.conversationInboxRepository) {
      await this.conversationInboxRepository.save(item as any)
      const thread = {
        id: `mth-${Date.now()}`,
        inboxId: item.id,
        messages: [{ id: "msg-1", sender, text, timestamp: new Date() }],
      }
      await this.conversationInboxRepository.saveThread(thread as any)
    }
    this.processIncomingConversation({
      conversationId: item.id,
      pageId: item.fbPageId,
      accountId: "acc-mock",
      senderId: "sender-mock",
      senderName: sender,
      messageText: text
    })
    return item
  }

  public async getThread(inboxId: string): Promise<any> {
    if (this.conversationInboxRepository) {
      const thread = await this.conversationInboxRepository.findThreadByInboxId(inboxId)
      if (thread) return thread
    }
    return {
      id: `th-${inboxId}`,
      inboxId,
      messages: [{ id: "m-1", sender: "User", text: "Mock message", timestamp: new Date() }]
    }
  }

  public processIncomingConversation(payload: {
    conversationId: string
    pageId: string
    accountId: string
    senderId: string
    senderName?: string
    messageId?: string
    messageText: string
    timestamp?: Date
    metadata?: Record<string, any>
  }): { conversation: NormalizedMessengerConversation; isDuplicate: boolean } {
    if (!payload.conversationId) {
      throw new Error("Invalid payload: missing conversationId")
    }

    // Deduplication check by messageId if available
    if (payload.messageId && this.processedMessageIds.has(payload.messageId)) {
      const existing = this.conversationStore.get(payload.conversationId)!
      return { conversation: existing, isDuplicate: true }
    }
    if (payload.messageId) {
      this.processedMessageIds.add(payload.messageId)
    }

    const existing = this.conversationStore.get(payload.conversationId)
    const timestamp = payload.timestamp || new Date()

    if (existing) {
      existing.lastMessageText = payload.messageText.trim()
      existing.lastMessageTimestamp = timestamp
      existing.unreadCount += 1
      existing.isRead = false
      if (payload.metadata) {
        existing.metadata = { ...existing.metadata, ...payload.metadata }
      }
      return { conversation: existing, isDuplicate: false }
    }

    const conversation: NormalizedMessengerConversation = {
      conversationId: payload.conversationId,
      pageId: payload.pageId,
      accountId: payload.accountId,
      senderId: payload.senderId,
      senderName: payload.senderName || "Messenger User",
      lastMessageText: payload.messageText.trim(),
      lastMessageTimestamp: timestamp,
      unreadCount: 1,
      isRead: false,
      metadata: payload.metadata || {}
    }

    this.conversationStore.set(payload.conversationId, conversation)
    return { conversation, isDuplicate: false }
  }

  public markAsRead(conversationId: string): boolean {
    const conv = this.conversationStore.get(conversationId)
    if (!conv) return false
    conv.isRead = true
    conv.unreadCount = 0
    return true
  }

  public getGroupedByPage(): GroupedPageInbox[] {
    const groupedMap = new Map<string, NormalizedMessengerConversation[]>()

    for (const conv of this.conversationStore.values()) {
      const key = `${conv.pageId}:${conv.accountId}`
      if (!groupedMap.has(key)) {
        groupedMap.set(key, [])
      }
      groupedMap.get(key)!.push(conv)
    }

    const result: GroupedPageInbox[] = []
    for (const [key, convs] of groupedMap.entries()) {
      const [pageId, accountId] = key.split(":")
      const unreadCount = convs.filter((c) => !c.isRead).length
      result.push({
        pageId,
        accountId,
        totalConversations: convs.length,
        unreadConversationsCount: unreadCount,
        conversations: convs
      })
    }

    return result
  }

  public generateInboxQueueItem(conversationId: string): InboxQueueItem | null {
    const conv = this.conversationStore.get(conversationId)
    if (!conv) return null

    return {
      id: `iq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId: conv.conversationId,
      pageId: conv.pageId,
      accountId: conv.accountId,
      senderName: conv.senderName,
      lastMessageText: conv.lastMessageText,
      unreadCount: conv.unreadCount,
      enqueuedAt: new Date()
    }
  }

  public getAllConversations(): NormalizedMessengerConversation[] {
    return Array.from(this.conversationStore.values())
  }

  public async getInbox(): Promise<any[]> {
    if (this.conversationInboxRepository) {
      const dbItems = await this.conversationInboxRepository.findAll()
      if (dbItems && dbItems.length > 0) {
        return dbItems
      }
    }
    return this.getAllConversations().map((c) => ({
      id: c.conversationId,
      fbPageId: c.pageId,
      fbConversationId: c.conversationId,
      senderName: c.senderName,
      lastMessageText: c.lastMessageText,
      status: c.isRead ? "Replied" : "Pending",
      category: "General",
      createdAt: c.lastMessageTimestamp
    }))
  }

  public async getInboxById(id: string): Promise<any> {
    const list = await this.getInbox()
    const item = list.find((i) => i.id === id)
    if (!item) {
      throw new Error("Conversation Inbox item not found.")
    }
    return item
  }
}
