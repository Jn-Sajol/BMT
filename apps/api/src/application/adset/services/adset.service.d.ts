import { AdSetRepository } from '../../../infrastructure/database/repositories/ad-set.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdSetValidationService } from './adset-validation.service';
import { AdSetHistoryService } from './adset-history.service';
import { CreateAdSetDto, UpdateAdSetDto, AdSetResponseDto } from '../common/adset.dto';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
export declare class AdSetService {
    private readonly adSetRepo;
    private readonly campaignRepo;
    private readonly validationService;
    private readonly historyService;
    private readonly clockProvider;
    constructor(adSetRepo: AdSetRepository, campaignRepo: CampaignRepository, validationService: AdSetValidationService, historyService: AdSetHistoryService, clockProvider: IClockProvider);
    create(dto: CreateAdSetDto, workspaceId: string, userId: string): Promise<AdSetResponseDto>;
    update(id: string, dto: UpdateAdSetDto, workspaceId: string, userId: string): Promise<AdSetResponseDto>;
    findOne(id: string, workspaceId: string): Promise<AdSetResponseDto>;
    findByCampaignId(campaignId: string, workspaceId: string): Promise<AdSetResponseDto[]>;
    delete(id: string, workspaceId: string, userId: string): Promise<void>;
    restore(id: string, version: number, workspaceId: string, userId: string): Promise<AdSetResponseDto>;
}
