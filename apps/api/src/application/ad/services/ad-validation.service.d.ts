import { CreateAdDto, UpdateAdDto } from '../common/ad.dto';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdSetRepository } from '../../../infrastructure/database/repositories/ad-set.repository';
import { AdCreativeRepository } from '../../../infrastructure/database/repositories/ad-creative.repository';
export declare class AdValidationService {
    private readonly campaignRepo;
    private readonly adSetRepo;
    private readonly creativeRepo;
    constructor(campaignRepo: CampaignRepository, adSetRepo: AdSetRepository, creativeRepo: AdCreativeRepository);
    validateCreate(dto: CreateAdDto, workspaceId: string): Promise<void>;
    validateUpdate(dto: UpdateAdDto): Promise<void>;
}
