import { CampaignRepository } from '../../../../infrastructure/database/repositories/campaign.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { CampaignPublisher } from './campaign-publisher';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { CampaignResponseDto } from '../../../../common/dto/campaign.dto';
export declare class CampaignPublishService {
    private readonly campaignRepo;
    private readonly metaConnectionRepo;
    private readonly adAccountRepo;
    private readonly publisher;
    private readonly encryptionService;
    private readonly clockProvider;
    constructor(campaignRepo: CampaignRepository, metaConnectionRepo: MetaConnectionRepository, adAccountRepo: MetaAdAccountRepository, publisher: CampaignPublisher, encryptionService: IEncryption, clockProvider: IClockProvider);
    publish(campaignId: string, workspaceId: string, userId: string): Promise<CampaignResponseDto>;
}
