import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { MetaBusinessRepository } from '../../../../infrastructure/database/repositories/meta-business.repository';
import { MetaPageRepository } from '../../../../infrastructure/database/repositories/meta-page.repository';
import { MetaAdAccountRepository } from '../../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MetaInstagramAccountRepository } from '../../../../infrastructure/database/repositories/meta-instagram.repository';
import { MetaPixelRepository } from '../../../../infrastructure/database/repositories/meta-pixel.repository';
import { MetaCatalogRepository } from '../../../../infrastructure/database/repositories/meta-catalog.repository';
import { MetaSyncHistoryRepository } from '../../../../infrastructure/database/repositories/meta-sync-history.repository';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
export declare class MetaAssetSyncService {
    private readonly metaConnRepo;
    private readonly metaBusinessRepo;
    private readonly metaPageRepo;
    private readonly metaAdAccountRepo;
    private readonly metaInstagramRepo;
    private readonly metaPixelRepo;
    private readonly metaCatalogRepo;
    private readonly metaSyncHistoryRepo;
    private readonly graphClient;
    private readonly encryptionService;
    private readonly clockProvider;
    constructor(metaConnRepo: MetaConnectionRepository, metaBusinessRepo: MetaBusinessRepository, metaPageRepo: MetaPageRepository, metaAdAccountRepo: MetaAdAccountRepository, metaInstagramRepo: MetaInstagramAccountRepository, metaPixelRepo: MetaPixelRepository, metaCatalogRepo: MetaCatalogRepository, metaSyncHistoryRepo: MetaSyncHistoryRepository, graphClient: MetaGraphClient, encryptionService: IEncryption, clockProvider: IClockProvider);
    sync(workspaceId: string, userId: string): Promise<any>;
    private fetchPaginatedData;
    private applySoftDeletes;
}
