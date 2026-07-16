import { AdService } from '../services/ad.service';
import { AdHistoryService } from '../services/ad-history.service';
import { CreateAdDto, UpdateAdDto, AdResponseDto } from '../common/ad.dto';
import { AdRepository } from '../../../infrastructure/database/repositories/ad.repository';
export declare class AdController {
    private readonly adService;
    private readonly historyService;
    private readonly adRepo;
    constructor(adService: AdService, historyService: AdHistoryService, adRepo: AdRepository);
    create(dto: CreateAdDto, req: any): Promise<AdResponseDto>;
    findAll(req: any): Promise<AdResponseDto[]>;
    findOne(id: string, req: any): Promise<AdResponseDto>;
    update(id: string, dto: UpdateAdDto, req: any): Promise<AdResponseDto>;
    remove(id: string, req: any): Promise<void>;
    duplicate(id: string, req: any): Promise<AdResponseDto>;
    restore(id: string, versionStr: string, req: any): Promise<AdResponseDto>;
    getHistory(id: string): Promise<any[]>;
}
