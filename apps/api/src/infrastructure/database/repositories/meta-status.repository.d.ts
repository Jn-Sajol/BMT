import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaStatusRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findCampaignStatusDetail(campaignId: string): Promise<any | null>;
    findAdSetStatusDetail(adSetId: string): Promise<any | null>;
    findAdStatusDetail(adId: string): Promise<any | null>;
    updateCampaignStatus(campaignId: string, effectiveStatus: string, reviewStatus: string, deliveryStatus: string, rawPayload: any, lastSyncedAt: Date): Promise<void>;
    updateAdSetStatus(adSetId: string, effectiveStatus: string, reviewStatus: string, deliveryStatus: string, rawPayload: any, lastSyncedAt: Date): Promise<void>;
    updateAdStatus(adId: string, effectiveStatus: string, reviewStatus: string, deliveryStatus: string, rawPayload: any, lastSyncedAt: Date): Promise<void>;
}
