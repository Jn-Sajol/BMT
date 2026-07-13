import { Injectable } from '@nestjs/common';
import { CampaignRepository } from '../../infrastructure/database/repositories/campaign.repository';
import { CampaignHistory, Campaign } from '@prisma/client';

@Injectable()
export class CampaignHistoryService {
  constructor(private readonly campaignRepo: CampaignRepository) {}

  async createSnapshot(campaign: Campaign, authorId: string): Promise<CampaignHistory> {
    const history: CampaignHistory = {
      id: '',
      campaignId: campaign.id,
      version: campaign.draftVersion,
      snapshot: JSON.parse(JSON.stringify(campaign)),
      authorId,
      createdAt: new Date(),
    };
    return await this.campaignRepo.saveHistory(history);
  }

  async getHistory(campaignId: string): Promise<CampaignHistory[]> {
    return await this.campaignRepo.findHistoryByCampaignId(campaignId);
  }

  async getSnapshot(campaignId: string, version: number): Promise<CampaignHistory | null> {
    return await this.campaignRepo.findHistoryByCampaignIdAndVersion(campaignId, version);
  }
}
