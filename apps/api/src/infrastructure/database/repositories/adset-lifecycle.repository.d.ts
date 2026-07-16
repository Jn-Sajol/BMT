import { ExtendedPrismaClient } from '../prisma-extensions';
import { AdSet, CampaignStatus, AdSetLifecycleHistory } from '@prisma/client';
export declare class AdSetLifecycleRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<(AdSet & {
        campaign: any;
        statusDetail: any | null;
    }) | null>;
    updateAdSetStatus(adSetId: string, status: CampaignStatus, effectiveStatus: string, lastSyncedAt: Date, rawResponse: any, updatedBy: string): Promise<AdSet>;
    updateAdSetAttributes(adSetId: string, data: {
        name?: string;
        dailyBudget?: number;
        lifetimeBudget?: number;
        bidAmount?: number;
        bidStrategy?: string;
        optimizationGoal?: string;
        billingEvent?: string;
        startTime?: Date;
        endTime?: Date;
        targeting?: any;
        updatedBy: string;
    }): Promise<AdSet>;
    insertHistory(adSetId: string, action: string, beforeStatus: string, afterStatus: string, performedBy: string, performedAt: Date, metaResponse: any): Promise<AdSetLifecycleHistory>;
}
