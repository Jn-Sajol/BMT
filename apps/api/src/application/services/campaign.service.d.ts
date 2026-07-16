import { CampaignRepository } from '../../infrastructure/database/repositories/campaign.repository';
import { CampaignValidationService } from './campaign-validation.service';
import { CampaignHistoryService } from './campaign-history.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignResponseDto } from '../../common/dto/campaign.dto';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
export declare class CampaignService {
    private readonly campaignRepo;
    private readonly validationService;
    private readonly historyService;
    private readonly clockProvider;
    constructor(campaignRepo: CampaignRepository, validationService: CampaignValidationService, historyService: CampaignHistoryService, clockProvider: IClockProvider);
    create(dto: CreateCampaignDto, workspaceId: string, organizationId: string, userId: string): Promise<CampaignResponseDto>;
    update(id: string, dto: UpdateCampaignDto, workspaceId: string, userId: string): Promise<CampaignResponseDto>;
    findOne(id: string, workspaceId: string): Promise<CampaignResponseDto>;
    findAll(workspaceId: string): Promise<CampaignResponseDto[]>;
    delete(id: string, workspaceId: string, userId: string): Promise<void>;
    duplicate(id: string, workspaceId: string, userId: string): Promise<CampaignResponseDto>;
    restore(id: string, version: number, workspaceId: string, userId: string): Promise<CampaignResponseDto>;
}
