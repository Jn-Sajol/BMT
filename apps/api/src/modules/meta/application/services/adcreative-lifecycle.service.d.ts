import { AdCreativeLifecycleRepository } from '../../../../infrastructure/database/repositories/adcreative-lifecycle.repository';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { AdCreativeLifecyclePublisher } from './adcreative-creative-publisher';
import { UpdateAdCreativeDto, AdCreativeLifecycleHistoryDto } from './adcreative-lifecycle.dto';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
export declare class AdCreativeLifecycleService {
    private readonly lifecycleRepo;
    private readonly connectionRepo;
    private readonly publisher;
    private readonly clockProvider;
    private readonly encryptionService;
    constructor(lifecycleRepo: AdCreativeLifecycleRepository, connectionRepo: MetaConnectionRepository, publisher: AdCreativeLifecyclePublisher, clockProvider: IClockProvider, encryptionService: IEncryption);
    updateAdCreative(creativeId: string, workspaceId: string, userId: string, dto: UpdateAdCreativeDto): Promise<AdCreativeLifecycleHistoryDto>;
    private getAccessToken;
}
