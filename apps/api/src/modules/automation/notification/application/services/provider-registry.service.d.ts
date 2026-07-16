import { INotificationProvider, NotificationPayload } from '../../domain/ports/notification-provider.interface';
export declare class EmailProvider implements INotificationProvider {
    channelName: string;
    send(payload: NotificationPayload): Promise<{
        success: boolean;
        deliveryId: string;
    }>;
}
export declare class WebhookProvider implements INotificationProvider {
    channelName: string;
    send(payload: NotificationPayload): Promise<{
        success: boolean;
        deliveryId: string;
    }>;
}
export declare class InAppProvider implements INotificationProvider {
    channelName: string;
    send(payload: NotificationPayload): Promise<{
        success: boolean;
        deliveryId: string;
    }>;
}
export declare class SlackProvider implements INotificationProvider {
    channelName: string;
    send(payload: NotificationPayload): Promise<{
        success: boolean;
        deliveryId: string;
    }>;
}
export declare class ProviderRegistryService {
    private providers;
    constructor();
    register(provider: INotificationProvider): void;
    resolve(channel: string): INotificationProvider | undefined;
    getChannels(): string[];
}
