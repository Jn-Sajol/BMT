import { AdRepository } from '../../../../infrastructure/database/repositories/ad.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { AdCreativeRepository } from '../../../../infrastructure/database/repositories/ad-creative.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaAdPublisher } from './ad-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { AdResponseDto } from '../../../../application/ad/common/ad.dto';
export declare class AdPublishService {
    private readonly adRepo;
    private readonly campaignRepo;
    private readonly adSetRepo;
    private readonly creativeRepo;
    private readonly metaConnectionRepo;
    private readonly adAccountRepo;
    private readonly publisher;
    private readonly encryptionService;
    private readonly clockProvider;
    constructor(adRepo: AdRepository, campaignRepo: CampaignRepository, adSetRepo: AdSetRepository, creativeRepo: AdCreativeRepository, metaConnectionRepo: MetaConnectionRepository, adAccountRepo: MetaAdAccountRepository, publisher: MetaAdPublisher, encryptionService: IEncryption, clockProvider: IClockProvider);
    publish(adId: string, workspaceId: string, userId: string): Promise<AdResponseDto>;
}
