export type CommentStatus = "Pending" | "Approved" | "Ignored" | "Deleted" | "Archived"

export interface CommentAuthor {
  id: string
  name: string
  fbUserId: string
}

export interface LinkComment {
  id: string
  commentId: string
  postId: string
  author: CommentAuthor
  text: string
  detectedLinks: string[]
  status: CommentStatus
  createdAt: Date
}

export interface CommentHistory {
  id: string
  commentId: string
  action: "approve" | "ignore" | "delete" | "archive"
  moderator: string
  timestamp: Date
  reason?: string
}

export interface ModerationSettings {
  blockedKeywords: string[]
  allowedKeywords: string[]
  blockedDomains: string[]
}
