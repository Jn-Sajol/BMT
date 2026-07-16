import { AdSetRepository } from '../../../../infrastructure/database/repositories/ad-set.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { AdSetPublisher } from './adset-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { AdSetResponseDto } from '../../../../application/adset/common/adset.dto';
export declare class AdSetPublishService {
    private readonly adSetRepo;
    private readonly campaignRepo;
    private readonly metaConnectionRepo;
    private readonly adAccountRepo;
    private readonly publisher;
    private readonly encryptionService;
    private readonly clockProvider;
    constructor(adSetRepo: AdSetRepository, campaignRepo: CampaignRepository, metaConnectionRepo: MetaConnectionRepository, adAccountRepo: MetaAdAccountRepository, publisher: AdSetPublisher, encryptionService: IEncryption, clockProvider: IClockProvider);
    publish(adSetId: string, workspaceId: string, userId: string): Promise<AdSetResponseDto>;
}
