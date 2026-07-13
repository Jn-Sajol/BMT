import { Injectable } from '@nestjs/common';
import { CampaignInsightRepository } from '../../../../infrastructure/database/repositories/campaign-insight.repository';
import { AdSetInsightRepository } from '../../../../infrastructure/database/repositories/adset-insight.repository';
import { AdInsightRepository } from '../../../../infrastructure/database/repositories/ad-insight.repository';
import {
  CampaignInsightResponseDto,
  AdSetInsightResponseDto,
  AdInsightResponseDto,
} from './meta-insights.dto';
import { MetaInsightsMapper } from './meta-insights.mapper';

@Injectable()
export class MetaInsightsService {
  constructor(
    private readonly campaignInsightRepo: CampaignInsightRepository,
    private readonly adSetInsightRepo: AdSetInsightRepository,
    private readonly adInsightRepo: AdInsightRepository,
  ) {}

  async getCampaignInsights(workspaceId: string): Promise<CampaignInsightResponseDto[]> {
    const list = await this.campaignInsightRepo.findByWorkspaceId(workspaceId);
    return list.map(MetaInsightsMapper.toCampaignResponse);
  }

  async getAdSetInsights(workspaceId: string): Promise<AdSetInsightResponseDto[]> {
    const list = await this.adSetInsightRepo.findByWorkspaceId(workspaceId);
    return list.map(MetaInsightsMapper.toAdSetResponse);
  }

  async getAdInsights(workspaceId: string): Promise<AdInsightResponseDto[]> {
    const list = await this.adInsightRepo.findByWorkspaceId(workspaceId);
    return list.map(MetaInsightsMapper.toAdResponse);
  }
}
