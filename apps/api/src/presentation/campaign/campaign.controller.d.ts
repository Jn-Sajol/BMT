import { CampaignService } from '../../application/services/campaign.service';
import { CampaignHistoryService } from '../../application/services/campaign-history.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignResponseDto } from '../../common/dto/campaign.dto';
export declare class CampaignController {
    private readonly campaignService;
    private readonly historyService;
    constructor(campaignService: CampaignService, historyService: CampaignHistoryService);
    create(dto: CreateCampaignDto, req: any): Promise<CampaignResponseDto>;
    findAll(req: any): Promise<CampaignResponseDto[]>;
    findOne(id: string, req: any): Promise<CampaignResponseDto>;
    update(id: string, dto: UpdateCampaignDto, req: any): Promise<CampaignResponseDto>;
    remove(id: string, req: any): Promise<void>;
    duplicate(id: string, req: any): Promise<CampaignResponseDto>;
    restore(id: string, versionStr: string, req: any): Promise<CampaignResponseDto>;
    getHistory(id: string): Promise<any[]>;
}
