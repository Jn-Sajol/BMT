import { CampaignLifecycleRepository } from '../../../../infrastructure/database/repositories/campaign-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignLifecyclePublisher } from './campaign-lifecycle-publisher';
import { UpdateCampaignDto, CampaignLifecycleHistoryDto } from './campaign-lifecycle.dto';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
export declare class CampaignLifecycleService {
    private readonly lifecycleRepo;
    private readonly connectionRepo;
    private readonly publisher;
    private readonly clockProvider;
    private readonly encryptionService;
    constructor(lifecycleRepo: CampaignLifecycleRepository, connectionRepo: MetaConnectionRepository, publisher: CampaignLifecyclePublisher, clockProvider: IClockProvider, encryptionService: IEncryption);
    updateCampaign(campaignId: string, workspaceId: string, userId: string, dto: UpdateCampaignDto): Promise<CampaignLifecycleHistoryDto>;
    pauseCampaign(campaignId: string, workspaceId: string, userId: string): Promise<CampaignLifecycleHistoryDto>;
    resumeCampaign(campaignId: string, workspaceId: string, userId: string): Promise<CampaignLifecycleHistoryDto>;
    archiveCampaign(campaignId: string, workspaceId: string, userId: string): Promise<CampaignLifecycleHistoryDto>;
    private loadAndValidateCampaign;
    private getAccessToken;
}
