import { AdSetLifecycleRepository } from '../../../../infrastructure/database/repositories/adset-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { AdSetLifecyclePublisher } from './adset-lifecycle-publisher';
import { UpdateAdSetDto, AdSetLifecycleHistoryDto } from './adset-lifecycle.dto';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
export declare class AdSetLifecycleService {
    private readonly lifecycleRepo;
    private readonly connectionRepo;
    private readonly publisher;
    private readonly clockProvider;
    private readonly encryptionService;
    constructor(lifecycleRepo: AdSetLifecycleRepository, connectionRepo: MetaConnectionRepository, publisher: AdSetLifecyclePublisher, clockProvider: IClockProvider, encryptionService: IEncryption);
    updateAdSet(adSetId: string, workspaceId: string, userId: string, dto: UpdateAdSetDto): Promise<AdSetLifecycleHistoryDto>;
    pauseAdSet(adSetId: string, workspaceId: string, userId: string): Promise<AdSetLifecycleHistoryDto>;
    resumeAdSet(adSetId: string, workspaceId: string, userId: string): Promise<AdSetLifecycleHistoryDto>;
    archiveAdSet(adSetId: string, workspaceId: string, userId: string): Promise<AdSetLifecycleHistoryDto>;
    private loadAndValidateAdSet;
    private getAccessToken;
}
