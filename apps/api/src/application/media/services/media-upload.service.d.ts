import { MediaRepository } from '../../../infrastructure/database/repositories/media.repository';
import { MetaConnectionRepository } from '../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { MetaAdAccountRepository } from '../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MediaValidationService } from './media-validation.service';
import { MetaMediaUploader } from './meta-media-uploader';
import { MediaHistoryService } from './media-history.service';
import { CreateMediaFolderDto, MediaAssetResponseDto, MediaFolderResponseDto } from '../common/media.dto';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
import { IEncryption } from '../../../common/ports/encryption.interface';
export declare class MediaUploadService {
    private readonly mediaRepo;
    private readonly connectionRepo;
    private readonly campaignRepo;
    private readonly adAccountRepo;
    private readonly validationService;
    private readonly uploader;
    private readonly historyService;
    private readonly clockProvider;
    private readonly encryptionService;
    constructor(mediaRepo: MediaRepository, connectionRepo: MetaConnectionRepository, campaignRepo: CampaignRepository, adAccountRepo: MetaAdAccountRepository, validationService: MediaValidationService, uploader: MetaMediaUploader, historyService: MediaHistoryService, clockProvider: IClockProvider, encryptionService: IEncryption);
    createFolder(dto: CreateMediaFolderDto, workspaceId: string): Promise<MediaFolderResponseDto>;
    upload(fileBuffer: Buffer, originalFilename: string, mimeType: string, workspaceId: string, userId: string, folderId?: string): Promise<MediaAssetResponseDto>;
    getFolders(workspaceId: string): Promise<MediaFolderResponseDto[]>;
    getAssets(workspaceId: string): Promise<MediaAssetResponseDto[]>;
    deleteAsset(id: string, workspaceId: string): Promise<void>;
    deleteFolder(id: string, workspaceId: string): Promise<void>;
}
