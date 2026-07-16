import { CampaignInsight, AdSetInsight, AdInsight, InsightSyncHistory } from '@prisma/client';
import { CampaignInsightResponseDto, AdSetInsightResponseDto, AdInsightResponseDto, SyncHistoryResponseDto } from './meta-insights.dto';
export declare class MetaInsightsMapper {
    static toCampaignResponse(entity: CampaignInsight): CampaignInsightResponseDto;
    static toAdSetResponse(entity: AdSetInsight): AdSetInsightResponseDto;
    static toAdResponse(entity: AdInsight): AdInsightResponseDto;
    static toSyncHistoryResponse(entity: InsightSyncHistory): SyncHistoryResponseDto;
}
