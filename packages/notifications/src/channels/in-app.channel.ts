import { INotificationChannel, NotificationPayload } from "../core/notification.interface"

export class InAppChannel implements INotificationChannel {
  public async send(payload: NotificationPayload): Promise<{ success: boolean }> {
    console.log(`[InAppChannel] Dispatching in-app notification to user: ${payload.userId}`)
    return { success: true }
  }
}
