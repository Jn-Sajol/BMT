export interface CommentInbox {
  id: string
  fbPostId: string
  commentId: string
  authorName: string
  content: string
  status: "Pending" | "Replied" | "Archived"
  createdAt: Date
}

export interface CommentThread {
  id: string
  inboxId: string
  messages: Array<{
    id: string
    sender: string
    text: string
    timestamp: Date
  }>
}

export interface ReplySuggestion {
  id: string
  inboxId: string
  suggestions: string[]
}

export interface ReplyHistory {
  id: string
  inboxId: string
  originalComment: string
  selectedReply: string
  editedReply?: string
  user: string
  timestamp: Date
}

export interface ReplySettings {
  autoGenerateSuggestions: boolean
  maxRepliesDaily: number
}

export interface ReplyCampaign {
  id: string
  title: string
  status: "Active" | "Archived"
}
