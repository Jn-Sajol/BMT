import { AdRepository } from '../../../infrastructure/database/repositories/ad.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdValidationService } from './ad-validation.service';
import { AdHistoryService } from './ad-history.service';
import { CreateAdDto, UpdateAdDto, AdResponseDto } from '../common/ad.dto';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
export declare class AdService {
    private readonly adRepo;
    private readonly campaignRepo;
    private readonly validationService;
    private readonly historyService;
    private readonly clockProvider;
    constructor(adRepo: AdRepository, campaignRepo: CampaignRepository, validationService: AdValidationService, historyService: AdHistoryService, clockProvider: IClockProvider);
    create(dto: CreateAdDto, workspaceId: string, userId: string): Promise<AdResponseDto>;
    update(id: string, dto: UpdateAdDto, workspaceId: string, userId: string): Promise<AdResponseDto>;
    findOne(id: string, workspaceId: string): Promise<AdResponseDto>;
    findByCampaignId(campaignId: string, workspaceId: string): Promise<AdResponseDto[]>;
    findByAdSetId(adSetId: string, workspaceId: string): Promise<AdResponseDto[]>;
    delete(id: string, workspaceId: string, userId: string): Promise<void>;
    duplicate(id: string, workspaceId: string, userId: string): Promise<AdResponseDto>;
    restore(id: string, version: number, workspaceId: string, userId: string): Promise<AdResponseDto>;
}
