import { CampaignPublishService } from '../application/services/campaign-publish.service';
import { CampaignResponseDto } from '../../../common/dto/campaign.dto';
export declare class CampaignPublishController {
    private readonly publishService;
    constructor(publishService: CampaignPublishService);
    publish(id: string, req: any): Promise<CampaignResponseDto>;
}
