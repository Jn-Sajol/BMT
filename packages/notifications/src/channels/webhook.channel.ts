import { INotificationChannel, NotificationPayload } from "../core/notification.interface"

export class WebhookChannel implements INotificationChannel {
  public async send(payload: NotificationPayload): Promise<{ success: boolean }> {
    console.log(`[WebhookChannel] Triggering payload callback to destination: ${payload.userId}`)
    return { success: true }
  }
}
