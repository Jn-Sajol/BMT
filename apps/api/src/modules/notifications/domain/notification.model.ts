export interface Notification {
  id: string
  userId: string
  workspaceId: string
  title: string
  content: string
  channel: "in-app" | "email" | "slack" | "webhook"
  isRead: boolean
  status: "pending" | "sent" | "failed"
  retryCount: number
  errorMessage?: string
  createdAt: string
  readAt?: string
}
