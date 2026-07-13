export interface NotificationPayload {
  recipient: string;
  subject?: string;
  body: string;
  metadata?: any;
}

export interface INotificationProvider {
  channelName: string;
  send(payload: NotificationPayload): Promise<{
    success: boolean;
    deliveryId?: string;
    error?: string;
  }>;
}
