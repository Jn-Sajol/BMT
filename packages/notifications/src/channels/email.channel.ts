import { INotificationChannel, NotificationPayload } from "../core/notification.interface"

export class EmailChannel implements INotificationChannel {
  public async send(payload: NotificationPayload): Promise<{ success: boolean }> {
    console.log(`[EmailChannel] Sending email alert to user: ${payload.userId}`)
    return { success: true }
  }
}
