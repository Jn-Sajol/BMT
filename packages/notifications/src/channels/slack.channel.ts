import { INotificationChannel, NotificationPayload } from "../core/notification.interface"

export class SlackChannel implements INotificationChannel {
  public async send(payload: NotificationPayload): Promise<{ success: boolean }> {
    console.log(`[SlackChannel] Posting alert to workspace slack stream: ${payload.workspaceId}`)
    return { success: true }
  }
}
