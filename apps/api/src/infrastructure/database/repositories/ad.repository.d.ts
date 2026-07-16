import { Ad, AdHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class AdRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<Ad | null>;
    findByWorkspaceId(workspaceId: string): Promise<Ad[]>;
    findByCampaignId(campaignId: string): Promise<Ad[]>;
    findByAdSetId(adSetId: string): Promise<Ad[]>;
    save(entity: Ad, labels?: string[], tags?: string[]): Promise<Ad>;
    saveHistory(history: AdHistory): Promise<AdHistory>;
    findHistoryByAdId(adId: string): Promise<AdHistory[]>;
    findHistoryByAdIdAndVersion(adId: string, version: number): Promise<AdHistory | null>;
}
