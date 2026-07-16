import { AdSetLifecycleHistory } from '@prisma/client';
import { AdSetLifecycleHistoryDto } from './adset-lifecycle.dto';
export declare class AdSetLifecycleMapper {
    static toHistoryDto(entity: AdSetLifecycleHistory): AdSetLifecycleHistoryDto;
}
