import { Injectable } from "@nestjs/common"

export interface NotificationPayload {
  type: "REVIEW_REQUESTED" | "COMMENT_ADDED" | "MENTION" | "APPROVED" | "REJECTED" | "PUBLISHED"
  workflowId: string
  userId: string
  message: string
  timestamp: string
}

@Injectable()
export class NotificationService {
  private notifications: NotificationPayload[] = []

  public send(payload: NotificationPayload): void {
    this.notifications.push(payload)
    console.log(`[NotificationService] Notification dispatched: ${payload.type} - ${payload.message}`)
  }

  public getNotifications(): NotificationPayload[] {
    return this.notifications
  }
}
