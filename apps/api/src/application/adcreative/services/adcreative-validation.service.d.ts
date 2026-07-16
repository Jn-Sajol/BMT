import { CreateAdCreativeDto, UpdateAdCreativeDto } from '../common/adcreative.dto';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { MetaPageRepository } from '../../../infrastructure/database/repositories/meta-page.repository';
import { MetaInstagramAccountRepository } from '../../../infrastructure/database/repositories/meta-instagram.repository';
import { MetaPixelRepository } from '../../../infrastructure/database/repositories/meta-pixel.repository';
export declare class AdCreativeValidationService {
    private readonly campaignRepo;
    private readonly pageRepo;
    private readonly instagramRepo;
    private readonly pixelRepo;
    constructor(campaignRepo: CampaignRepository, pageRepo: MetaPageRepository, instagramRepo: MetaInstagramAccountRepository, pixelRepo: MetaPixelRepository);
    validateCreate(dto: CreateAdCreativeDto, workspaceId: string): Promise<void>;
    validateUpdate(dto: UpdateAdCreativeDto, workspaceId: string): Promise<void>;
}
