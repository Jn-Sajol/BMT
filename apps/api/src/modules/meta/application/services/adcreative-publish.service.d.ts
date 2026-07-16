import { AdCreativeRepository } from '../../../../infrastructure/database/repositories/ad-creative.repository';
import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaPageRepository } from '../../../../infrastructure/database/repositories/meta-page.repository';
import { MetaInstagramAccountRepository } from '../../../../infrastructure/database/repositories/meta-instagram.repository';
import { AdCreativePublisher } from './adcreative-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { AdCreativeResponseDto } from '../../../../application/adcreative/common/adcreative.dto';
export declare class AdCreativePublishService {
    private readonly adCreativeRepo;
    private readonly campaignRepo;
    private readonly metaConnectionRepo;
    private readonly adAccountRepo;
    private readonly pageRepo;
    private readonly instagramRepo;
    private readonly publisher;
    private readonly encryptionService;
    private readonly clockProvider;
    constructor(adCreativeRepo: AdCreativeRepository, campaignRepo: CampaignRepository, metaConnectionRepo: MetaConnectionRepository, adAccountRepo: MetaAdAccountRepository, pageRepo: MetaPageRepository, instagramRepo: MetaInstagramAccountRepository, publisher: AdCreativePublisher, encryptionService: IEncryption, clockProvider: IClockProvider);
    publish(creativeId: string, workspaceId: string, userId: string): Promise<AdCreativeResponseDto>;
}
