import { INotificationPreferenceStore } from '../../domain/ports/preference-store.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class NotificationPreferenceService implements INotificationPreferenceStore {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    isChannelAllowed(workspaceId: string, userId: string, channel: string, severity: string): Promise<boolean>;
    getQuietHours(workspaceId: string, userId: string): Promise<{
        startHour: number;
        endHour: number;
        enabled: boolean;
    } | null>;
}
