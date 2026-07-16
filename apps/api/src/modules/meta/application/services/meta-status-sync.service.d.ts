import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { AdRepository } from '../../../../infrastructure/database/repositories/ad.repository';
import { MetaStatusRepository } from '../../../../infrastructure/database/repositories/meta-status.repository';
import { StatusSyncHistoryRepository } from '../../../../infrastructure/database/repositories/status-sync-history.repository';
import { MetaGraphStatusClient } from './meta-graph-status-client';
import { StatusSyncHistoryDto } from './meta-status.dto';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
export declare class MetaStatusSyncService {
    private readonly connectionRepo;
    private readonly campaignRepo;
    private readonly adSetRepo;
    private readonly adRepo;
    private readonly statusRepo;
    private readonly historyRepo;
    private readonly graphStatusClient;
    private readonly clockProvider;
    private readonly encryptionService;
    constructor(connectionRepo: MetaConnectionRepository, campaignRepo: CampaignRepository, adSetRepo: AdSetRepository, adRepo: AdRepository, statusRepo: MetaStatusRepository, historyRepo: StatusSyncHistoryRepository, graphStatusClient: MetaGraphStatusClient, clockProvider: IClockProvider, encryptionService: IEncryption);
    getHistory(workspaceId: string): Promise<StatusSyncHistoryDto[]>;
    sync(workspaceId: string): Promise<StatusSyncHistoryDto>;
}
