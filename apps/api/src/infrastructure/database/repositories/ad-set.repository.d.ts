import { AdSet, AdSetHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class AdSetRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<AdSet | null>;
    findByCampaignId(campaignId: string): Promise<AdSet[]>;
    save(entity: AdSet, labels?: string[], tags?: string[]): Promise<AdSet>;
    saveHistory(history: AdSetHistory): Promise<AdSetHistory>;
    findHistoryByAdSetId(adsetId: string): Promise<AdSetHistory[]>;
    findHistoryByAdSetIdAndVersion(adsetId: string, version: number): Promise<AdSetHistory | null>;
}
