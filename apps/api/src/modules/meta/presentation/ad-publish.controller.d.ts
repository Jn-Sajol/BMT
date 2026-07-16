import { AdPublishService } from '../application/services/ad-publish.service';
import { AdResponseDto } from '../../../application/ad/common/ad.dto';
export declare class AdPublishController {
    private readonly publishService;
    constructor(publishService: AdPublishService);
    publish(id: string, req: any): Promise<AdResponseDto>;
}
