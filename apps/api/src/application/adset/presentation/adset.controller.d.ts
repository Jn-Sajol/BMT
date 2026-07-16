import { AdSetService } from '../services/adset.service';
import { AdSetHistoryService } from '../services/adset-history.service';
import { CreateAdSetDto, UpdateAdSetDto, AdSetResponseDto } from '../common/adset.dto';
export declare class AdSetController {
    private readonly adSetService;
    private readonly historyService;
    constructor(adSetService: AdSetService, historyService: AdSetHistoryService);
    create(dto: CreateAdSetDto, req: any): Promise<AdSetResponseDto>;
    findOne(id: string, req: any): Promise<AdSetResponseDto>;
    update(id: string, dto: UpdateAdSetDto, req: any): Promise<AdSetResponseDto>;
    remove(id: string, req: any): Promise<void>;
    restore(id: string, versionStr: string, req: any): Promise<AdSetResponseDto>;
    getHistory(id: string): Promise<any[]>;
    findByCampaign(campaignId: string, req: any): Promise<AdSetResponseDto[]>;
}
