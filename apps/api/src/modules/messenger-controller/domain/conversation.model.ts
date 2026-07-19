export type ConversationStatus = "Pending" | "Replied" | "Archived"

export type ConversationCategory = "Sales Conversion" | "Lead Conversion" | "Visit Conversion"

export interface ConversationInbox {
  id: string
  fbPageId: string
  fbConversationId: string
  senderName: string
  lastMessageText: string
  status: ConversationStatus
  category: ConversationCategory
  createdAt: Date
}

export interface ConversationThread {
  id: string
  inboxId: string
  messages: Array<{
    id: string
    sender: string
    text: string
    timestamp: Date
    attachmentsMetadata?: string[]
  }>
}

export interface AISuggestedReply {
  id: string
  inboxId: string
  suggestions: string[]
}

export interface ReplyHistory {
  id: string
  inboxId: string
  originalMessage: string
  selectedSuggestion: string
  editedMessage?: string
  user: string
  timestamp: Date
}

export interface ConversationSettings {
  maxDailyReplies: number
}
