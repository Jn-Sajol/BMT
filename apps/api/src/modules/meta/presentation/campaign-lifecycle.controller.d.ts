import { CampaignLifecycleService } from '../application/services/campaign-lifecycle.service';
import { UpdateCampaignDto, CampaignLifecycleHistoryDto } from '../application/services/campaign-lifecycle.dto';
export declare class CampaignLifecycleController {
    private readonly lifecycleService;
    constructor(lifecycleService: CampaignLifecycleService);
    updateCampaign(campaignId: string, dto: UpdateCampaignDto, req: any): Promise<CampaignLifecycleHistoryDto>;
    pauseCampaign(campaignId: string, req: any): Promise<CampaignLifecycleHistoryDto>;
    resumeCampaign(campaignId: string, req: any): Promise<CampaignLifecycleHistoryDto>;
    archiveCampaign(campaignId: string, req: any): Promise<CampaignLifecycleHistoryDto>;
}
