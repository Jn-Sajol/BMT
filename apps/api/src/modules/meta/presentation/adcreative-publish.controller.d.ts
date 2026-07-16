import { AdCreativePublishService } from '../application/services/adcreative-publish.service';
import { AdCreativeResponseDto } from '../../../application/adcreative/common/adcreative.dto';
export declare class AdCreativePublishController {
    private readonly publishService;
    constructor(publishService: AdCreativePublishService);
    publish(id: string, req: any): Promise<AdCreativeResponseDto>;
}
