import { CampaignRepository } from '../../infrastructure/database/repositories/campaign.repository';
import { CampaignHistory, Campaign } from '@prisma/client';
export declare class CampaignHistoryService {
    private readonly campaignRepo;
    constructor(campaignRepo: CampaignRepository);
    createSnapshot(campaign: Campaign, authorId: string): Promise<CampaignHistory>;
    getHistory(campaignId: string): Promise<CampaignHistory[]>;
    getSnapshot(campaignId: string, version: number): Promise<CampaignHistory | null>;
}
