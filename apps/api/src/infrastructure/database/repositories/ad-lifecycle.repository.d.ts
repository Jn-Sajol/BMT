import { ExtendedPrismaClient } from '../prisma-extensions';
import { Ad, CampaignStatus, AdLifecycleHistory } from '@prisma/client';
export declare class AdLifecycleRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<(Ad & {
        statusDetail: any | null;
    }) | null>;
    findByExternalAdId(externalAdId: string): Promise<Ad | null>;
    updateAdStatus(adId: string, status: CampaignStatus, effectiveStatus: string, lastSyncedAt: Date, rawResponse: any, updatedBy: string): Promise<Ad>;
    updateAdAttributes(adId: string, data: {
        name?: string;
        creativeId?: string;
        trackingSpecs?: any;
        updatedBy: string;
    }): Promise<Ad>;
    insertHistory(adId: string, action: string, beforeStatus: string, afterStatus: string, performedBy: string, performedAt: Date, metaResponse: any): Promise<AdLifecycleHistory>;
}
