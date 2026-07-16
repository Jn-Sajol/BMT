import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class NotificationController {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    getNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        workspaceId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        eventName: string;
        severity: string;
    }[]>;
    getHistory(req: any): Promise<({
        notification: {
            id: string;
            createdAt: Date;
            workspaceId: string;
            payload: import("@prisma/client/runtime/library").JsonValue;
            eventName: string;
            severity: string;
        };
    } & {
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        retryCount: number;
        notificationId: string;
        channel: string;
        recipient: string;
    })[]>;
    getTemplates(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        version: number;
        subject: string | null;
        body: string;
    }[]>;
    createTemplate(name: string, subject: string, body: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        version: number;
        subject: string | null;
        body: string;
    }>;
    updateTemplate(id: string, subject: string, body: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        version: number;
        subject: string | null;
        body: string;
    }>;
    deleteTemplate(id: string): Promise<{
        success: boolean;
    }>;
    getPreferences(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        workspaceId: string;
        channel: string;
        enabled: boolean;
        severityLevel: string;
    }[]>;
    updatePreferences(channel: string, enabled: boolean, severityLevel: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        workspaceId: string;
        channel: string;
        enabled: boolean;
        severityLevel: string;
    }>;
    getProviders(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        enabled: boolean;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    createProvider(name: string, config: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        enabled: boolean;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateProvider(id: string, config: any, enabled: boolean): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        enabled: boolean;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    testNotification(channel: string, recipient: string, req: any): Promise<{
        success: boolean;
        notificationId: string;
        deliveryId: string;
    }>;
    checkHealth(req: any): Promise<{
        status: string;
        pendingDeliveries: number;
        failedDeliveries: number;
        deliveredNotifications: number;
        activeChannels: string[];
    }>;
}
