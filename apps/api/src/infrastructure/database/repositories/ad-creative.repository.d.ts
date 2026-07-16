import { AdCreative, AdCreativeHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class AdCreativeRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<AdCreative | null>;
    findByCampaignId(campaignId: string): Promise<AdCreative[]>;
    save(entity: AdCreative, labels?: string[], tags?: string[]): Promise<AdCreative>;
    saveHistory(history: AdCreativeHistory): Promise<AdCreativeHistory>;
    findHistoryByAdCreativeId(adCreativeId: string): Promise<AdCreativeHistory[]>;
    findHistoryByAdCreativeIdAndVersion(adCreativeId: string, version: number): Promise<AdCreativeHistory | null>;
}
