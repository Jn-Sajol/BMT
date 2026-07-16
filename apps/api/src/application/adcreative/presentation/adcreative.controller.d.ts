import { AdCreativeService } from '../services/adcreative.service';
import { AdCreativeHistoryService } from '../services/adcreative-history.service';
import { CreateAdCreativeDto, UpdateAdCreativeDto, AdCreativeResponseDto } from '../common/adcreative.dto';
export declare class AdCreativeController {
    private readonly creativeService;
    private readonly historyService;
    constructor(creativeService: AdCreativeService, historyService: AdCreativeHistoryService);
    create(dto: CreateAdCreativeDto, req: any): Promise<AdCreativeResponseDto>;
    findOne(id: string, req: any): Promise<AdCreativeResponseDto>;
    update(id: string, dto: UpdateAdCreativeDto, req: any): Promise<AdCreativeResponseDto>;
    remove(id: string, req: any): Promise<void>;
    restore(id: string, versionStr: string, req: any): Promise<AdCreativeResponseDto>;
    getHistory(id: string): Promise<any[]>;
    findByCampaign(campaignId: string, req: any): Promise<AdCreativeResponseDto[]>;
}
