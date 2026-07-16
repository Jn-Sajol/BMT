import { AdLifecycleService } from '../application/services/ad-lifecycle.service';
import { UpdateAdDto, AdLifecycleHistoryDto } from '../application/services/ad-lifecycle.dto';
export declare class AdLifecycleController {
    private readonly lifecycleService;
    constructor(lifecycleService: AdLifecycleService);
    updateAd(adId: string, dto: UpdateAdDto, req: any): Promise<AdLifecycleHistoryDto>;
    pauseAd(adId: string, req: any): Promise<AdLifecycleHistoryDto>;
    resumeAd(adId: string, req: any): Promise<AdLifecycleHistoryDto>;
    archiveAd(adId: string, req: any): Promise<AdLifecycleHistoryDto>;
}
