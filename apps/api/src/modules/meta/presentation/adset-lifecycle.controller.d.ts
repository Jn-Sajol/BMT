import { AdSetLifecycleService } from '../application/services/adset-lifecycle.service';
import { UpdateAdSetDto, AdSetLifecycleHistoryDto } from '../application/services/adset-lifecycle.dto';
export declare class AdSetLifecycleController {
    private readonly lifecycleService;
    constructor(lifecycleService: AdSetLifecycleService);
    updateAdSet(adSetId: string, dto: UpdateAdSetDto, req: any): Promise<AdSetLifecycleHistoryDto>;
    pauseAdSet(adSetId: string, req: any): Promise<AdSetLifecycleHistoryDto>;
    resumeAdSet(adSetId: string, req: any): Promise<AdSetLifecycleHistoryDto>;
    archiveAdSet(adSetId: string, req: any): Promise<AdSetLifecycleHistoryDto>;
}
