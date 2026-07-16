import { CreateCampaignDto, UpdateCampaignDto } from '../../common/dto/campaign.dto';
import { MetaBusinessRepository } from '../../infrastructure/database/repositories/meta-business.repository';
import { MetaAdAccountRepository } from '../../infrastructure/database/repositories/meta-ad-account.repository';
export declare class CampaignValidationService {
    private readonly businessRepo;
    private readonly adAccountRepo;
    constructor(businessRepo: MetaBusinessRepository, adAccountRepo: MetaAdAccountRepository);
    validateCreate(dto: CreateCampaignDto, workspaceId: string): Promise<void>;
    validateUpdate(dto: UpdateCampaignDto): Promise<void>;
}
