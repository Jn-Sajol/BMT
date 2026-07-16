import { CampaignInsightRepository } from '../../../../infrastructure/database/repositories/campaign-insight.repository';
import { AdSetInsightRepository } from '../../../../infrastructure/database/repositories/adset-insight.repository';
import { AdInsightRepository } from '../../../../infrastructure/database/repositories/ad-insight.repository';
import { CampaignInsightResponseDto, AdSetInsightResponseDto, AdInsightResponseDto } from './meta-insights.dto';
export declare class MetaInsightsService {
    private readonly campaignInsightRepo;
    private readonly adSetInsightRepo;
    private readonly adInsightRepo;
    constructor(campaignInsightRepo: CampaignInsightRepository, adSetInsightRepo: AdSetInsightRepository, adInsightRepo: AdInsightRepository);
    getCampaignInsights(workspaceId: string): Promise<CampaignInsightResponseDto[]>;
    getAdSetInsights(workspaceId: string): Promise<AdSetInsightResponseDto[]>;
    getAdInsights(workspaceId: string): Promise<AdInsightResponseDto[]>;
}
