import { ExtendedPrismaClient } from '../prisma-extensions';
import { Campaign, CampaignStatus, CampaignLifecycleHistory } from '@prisma/client';
export declare class CampaignLifecycleRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<(Campaign & {
        statusDetail: any | null;
    }) | null>;
    updateCampaignStatus(campaignId: string, status: CampaignStatus, effectiveStatus: string, lastSyncedAt: Date, rawResponse: any, updatedBy: string): Promise<Campaign>;
    updateCampaignAttributes(campaignId: string, name?: string, specialAdCategory?: string, buyingType?: string, updatedBy?: string): Promise<Campaign>;
    insertHistory(campaignId: string, action: string, beforeStatus: string, afterStatus: string, performedBy: string, performedAt: Date, metaResponse: any): Promise<CampaignLifecycleHistory>;
}
