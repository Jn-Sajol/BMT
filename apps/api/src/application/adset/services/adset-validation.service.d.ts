import { CreateAdSetDto, UpdateAdSetDto } from '../common/adset.dto';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { MetaPixelRepository } from '../../../infrastructure/database/repositories/meta-pixel.repository';
import { MetaPageRepository } from '../../../infrastructure/database/repositories/meta-page.repository';
import { MetaInstagramAccountRepository } from '../../../infrastructure/database/repositories/meta-instagram.repository';
export declare class AdSetValidationService {
    private readonly campaignRepo;
    private readonly pixelRepo;
    private readonly pageRepo;
    private readonly instagramRepo;
    constructor(campaignRepo: CampaignRepository, pixelRepo: MetaPixelRepository, pageRepo: MetaPageRepository, instagramRepo: MetaInstagramAccountRepository);
    validateCreate(dto: CreateAdSetDto, workspaceId: string): Promise<void>;
    validateUpdate(dto: UpdateAdSetDto, workspaceId: string): Promise<void>;
}
