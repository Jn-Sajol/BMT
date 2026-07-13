import { Injectable } from '@nestjs/common';
import { CampaignInsightRepository } from './campaign-insight.repository';
import { AdSetInsightRepository } from './adset-insight.repository';
import { AdInsightRepository } from './ad-insight.repository';

@Injectable()
export class MetaInsightRepository {
  constructor(
    public readonly campaigns: CampaignInsightRepository,
    public readonly adsets: AdSetInsightRepository,
    public readonly ads: AdInsightRepository,
  ) {}
}
