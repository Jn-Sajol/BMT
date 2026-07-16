import { Campaign, CampaignHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class CampaignRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<Campaign | null>;
    findByWorkspaceId(workspaceId: string): Promise<Campaign[]>;
    save(entity: Campaign, labels?: string[], tags?: string[]): Promise<Campaign>;
    saveHistory(history: CampaignHistory): Promise<CampaignHistory>;
    findHistoryByCampaignId(campaignId: string): Promise<CampaignHistory[]>;
    findHistoryByCampaignIdAndVersion(campaignId: string, version: number): Promise<CampaignHistory | null>;
}
