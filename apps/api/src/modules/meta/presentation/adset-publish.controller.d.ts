import { AdSetPublishService } from '../application/services/adset-publish.service';
import { AdSetResponseDto } from '../../../application/adset/common/adset.dto';
export declare class AdSetPublishController {
    private readonly publishService;
    constructor(publishService: AdSetPublishService);
    publish(id: string, req: any): Promise<AdSetResponseDto>;
}
