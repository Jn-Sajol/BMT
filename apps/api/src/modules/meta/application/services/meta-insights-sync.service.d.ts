import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { AdRepository } from '../../../../infrastructure/database/repositories/ad.repository';
import { CampaignInsightRepository } from '../../../../infrastructure/database/repositories/campaign-insight.repository';
import { AdSetInsightRepository } from '../../../../infrastructure/database/repositories/adset-insight.repository';
import { AdInsightRepository } from '../../../../infrastructure/database/repositories/ad-insight.repository';
import { InsightSyncHistoryRepository } from '../../../../infrastructure/database/repositories/insight-sync-history.repository';
import { MetaGraphInsightsClient } from './meta-graph-insights-client';
import { SyncInsightsDto, SyncHistoryResponseDto } from './meta-insights.dto';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
export declare class MetaInsightsSyncService {
    private readonly connectionRepo;
    private readonly campaignRepo;
    private readonly adSetRepo;
    private readonly adRepo;
    private readonly campaignInsightRepo;
    private readonly adSetInsightRepo;
    private readonly adInsightRepo;
    private readonly historyRepo;
    private readonly insightsClient;
    private readonly clockProvider;
    private readonly encryptionService;
    private readonly fields;
    constructor(connectionRepo: MetaConnectionRepository, campaignRepo: CampaignRepository, adSetRepo: AdSetRepository, adRepo: AdRepository, campaignInsightRepo: CampaignInsightRepository, adSetInsightRepo: AdSetInsightRepository, adInsightRepo: AdInsightRepository, historyRepo: InsightSyncHistoryRepository, insightsClient: MetaGraphInsightsClient, clockProvider: IClockProvider, encryptionService: IEncryption);
    sync(dto: SyncInsightsDto, workspaceId: string): Promise<SyncHistoryResponseDto>;
    private normalizeItem;
}
