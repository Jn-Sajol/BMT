export interface NotificationPayload {
  id: string
  userId: string
  workspaceId: string
  title: string
  content: string
  channel: "in-app" | "email" | "slack" | "webhook"
  status: "pending" | "sent" | "failed"
  retryCount: number
}

export interface INotificationChannel {
  send: (payload: NotificationPayload) => Promise<{ success: boolean; error?: string }>
}
