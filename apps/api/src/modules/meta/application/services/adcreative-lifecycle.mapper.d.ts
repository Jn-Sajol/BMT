import { AdCreativeLifecycleHistory } from '@prisma/client';
import { AdCreativeLifecycleHistoryDto } from './adcreative-lifecycle.dto';
export declare class AdCreativeLifecycleMapper {
    static toHistoryDto(entity: AdCreativeLifecycleHistory): AdCreativeLifecycleHistoryDto;
}
