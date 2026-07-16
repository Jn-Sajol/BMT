import { MetaStatusSyncService } from '../application/services/meta-status-sync.service';
import { StatusSyncHistoryDto } from '../application/services/meta-status.dto';
export declare class MetaStatusController {
    private readonly syncService;
    constructor(syncService: MetaStatusSyncService);
    sync(req: any): Promise<StatusSyncHistoryDto>;
    getHistory(req: any): Promise<StatusSyncHistoryDto[]>;
}
