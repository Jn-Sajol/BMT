import { AdLifecycleHistory } from '@prisma/client';
import { AdLifecycleHistoryDto } from './ad-lifecycle.dto';
export declare class AdLifecycleMapper {
    static toHistoryDto(entity: AdLifecycleHistory): AdLifecycleHistoryDto;
}
