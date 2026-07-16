import { AdLifecycleRepository } from '../../../../infrastructure/database/repositories/ad-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { AdCreativeRepository } from '../../../../infrastructure/database/repositories/ad-creative.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdLifecyclePublisher } from './ad-lifecycle-publisher';
import { UpdateAdDto, AdLifecycleHistoryDto } from './ad-lifecycle.dto';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
export declare class AdLifecycleService {
    private readonly lifecycleRepo;
    private readonly connectionRepo;
    private readonly creativeRepo;
    private readonly campaignRepo;
    private readonly publisher;
    private readonly clockProvider;
    private readonly encryptionService;
    constructor(lifecycleRepo: AdLifecycleRepository, connectionRepo: MetaConnectionRepository, creativeRepo: AdCreativeRepository, campaignRepo: CampaignRepository, publisher: AdLifecyclePublisher, clockProvider: IClockProvider, encryptionService: IEncryption);
    updateAd(adId: string, workspaceId: string, userId: string, dto: UpdateAdDto): Promise<AdLifecycleHistoryDto>;
    pauseAd(adId: string, workspaceId: string, userId: string): Promise<AdLifecycleHistoryDto>;
    resumeAd(adId: string, workspaceId: string, userId: string): Promise<AdLifecycleHistoryDto>;
    archiveAd(adId: string, workspaceId: string, userId: string): Promise<AdLifecycleHistoryDto>;
    private loadAndValidateAd;
    private getAccessToken;
}
