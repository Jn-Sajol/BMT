import { StatusSyncHistory } from '@prisma/client';
import { StatusSyncHistoryDto } from './meta-status.dto';
export declare class MetaStatusMapper {
    static toHistoryDto(entity: StatusSyncHistory): StatusSyncHistoryDto;
}
