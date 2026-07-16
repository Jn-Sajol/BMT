import { MetaInsightsService } from '../application/services/meta-insights.service';
import { MetaInsightsSyncService } from '../application/services/meta-insights-sync.service';
import { SyncInsightsDto, CampaignInsightResponseDto, AdSetInsightResponseDto, AdInsightResponseDto, SyncHistoryResponseDto } from '../application/services/meta-insights.dto';
export declare class MetaInsightsController {
    private readonly insightsService;
    private readonly syncService;
    constructor(insightsService: MetaInsightsService, syncService: MetaInsightsSyncService);
    sync(dto: SyncInsightsDto, req: any): Promise<SyncHistoryResponseDto>;
    getCampaigns(req: any): Promise<CampaignInsightResponseDto[]>;
    getAdSets(req: any): Promise<AdSetInsightResponseDto[]>;
    getAds(req: any): Promise<AdInsightResponseDto[]>;
}
