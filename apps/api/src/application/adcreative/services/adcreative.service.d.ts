import { AdCreativeRepository } from '../../../infrastructure/database/repositories/ad-creative.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { AdCreativeValidationService } from './adcreative-validation.service';
import { AdCreativeHistoryService } from './adcreative-history.service';
import { CreateAdCreativeDto, UpdateAdCreativeDto, AdCreativeResponseDto } from '../common/adcreative.dto';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
export declare class AdCreativeService {
    private readonly adCreativeRepo;
    private readonly campaignRepo;
    private readonly validationService;
    private readonly historyService;
    private readonly clockProvider;
    constructor(adCreativeRepo: AdCreativeRepository, campaignRepo: CampaignRepository, validationService: AdCreativeValidationService, historyService: AdCreativeHistoryService, clockProvider: IClockProvider);
    create(dto: CreateAdCreativeDto, workspaceId: string, userId: string): Promise<AdCreativeResponseDto>;
    update(id: string, dto: UpdateAdCreativeDto, workspaceId: string, userId: string): Promise<AdCreativeResponseDto>;
    findOne(id: string, workspaceId: string): Promise<AdCreativeResponseDto>;
    findByCampaignId(campaignId: string, workspaceId: string): Promise<AdCreativeResponseDto[]>;
    delete(id: string, workspaceId: string, userId: string): Promise<void>;
    restore(id: string, version: number, workspaceId: string, userId: string): Promise<AdCreativeResponseDto>;
}
