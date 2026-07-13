import { Injectable } from '@nestjs/common';
import { INotificationProvider, NotificationPayload } from '../../domain/ports/notification-provider.interface';

export class EmailProvider implements INotificationProvider {
  channelName = 'EMAIL';
  async send(payload: NotificationPayload) {
    return { success: true, deliveryId: `email-${Date.now()}` };
  }
}

export class WebhookProvider implements INotificationProvider {
  channelName = 'WEBHOOK';
  async send(payload: NotificationPayload) {
    return { success: true, deliveryId: `webhook-${Date.now()}` };
  }
}

export class InAppProvider implements INotificationProvider {
  channelName = 'IN_APP';
  async send(payload: NotificationPayload) {
    return { success: true, deliveryId: `inapp-${Date.now()}` };
  }
}

export class SlackProvider implements INotificationProvider {
  channelName = 'SLACK';
  async send(payload: NotificationPayload) {
    return { success: true, deliveryId: `slack-${Date.now()}` };
  }
}

@Injectable()
export class ProviderRegistryService {
  private providers = new Map<string, INotificationProvider>();

  constructor() {
    this.register(new EmailProvider());
    this.register(new WebhookProvider());
    this.register(new InAppProvider());
    this.register(new SlackProvider());
  }

  register(provider: INotificationProvider): void {
    this.providers.set(provider.channelName.toUpperCase(), provider);
  }

  resolve(channel: string): INotificationProvider | undefined {
    return this.providers.get(channel.toUpperCase());
  }

  getChannels(): string[] {
    return Array.from(this.providers.keys());
  }
}
