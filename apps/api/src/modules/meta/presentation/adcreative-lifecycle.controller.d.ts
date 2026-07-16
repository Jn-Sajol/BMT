import { AdCreativeLifecycleService } from '../application/services/adcreative-lifecycle.service';
import { UpdateAdCreativeDto, AdCreativeLifecycleHistoryDto } from '../application/services/adcreative-lifecycle.dto';
export declare class AdCreativeLifecycleController {
    private readonly lifecycleService;
    constructor(lifecycleService: AdCreativeLifecycleService);
    updateAdCreative(creativeId: string, dto: UpdateAdCreativeDto, req: any): Promise<AdCreativeLifecycleHistoryDto>;
}
