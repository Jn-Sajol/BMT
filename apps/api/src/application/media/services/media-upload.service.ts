import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { MediaRepository } from '../../../infrastructure/database/repositories/media.repository';
import { MetaConnectionRepository } from '../../../infrastructure/database/repositories/meta-connection.repository';
import { CampaignRepository } from '../../../infrastructure/database/repositories/campaign.repository';
import { MetaAdAccountRepository } from '../../../infrastructure/database/repositories/meta-ad-account.repository';
import { MediaValidationService } from './media-validation.service';
import { MetaMediaUploader } from './meta-media-uploader';
import { MediaHistoryService } from './media-history.service';
import { CreateMediaFolderDto, MediaAssetResponseDto, MediaFolderResponseDto } from '../common/media.dto';
import { MediaMapper } from '../common/media.mapper';
import { MediaAsset, MediaFolder } from '@prisma/client';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../../infrastructure/security/security.module';
import { IEncryption } from '../../../common/ports/encryption.interface';
import { ENCRYPTION_SERVICE } from '../../../infrastructure/security/security.module';

@Injectable()
export class MediaUploadService {
  constructor(
    private readonly mediaRepo: MediaRepository,
    private readonly connectionRepo: MetaConnectionRepository,
    private readonly campaignRepo: CampaignRepository,
    private readonly adAccountRepo: MetaAdAccountRepository,
    private readonly validationService: MediaValidationService,
    private readonly uploader: MetaMediaUploader,
    private readonly historyService: MediaHistoryService,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
  ) {}

  async createFolder(dto: CreateMediaFolderDto, workspaceId: string): Promise<MediaFolderResponseDto> {
    const now = this.clockProvider.now();
    const folder: MediaFolder = {
      id: '',
      workspaceId,
      parentId: dto.parentId || null,
      name: dto.name,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    const saved = await this.mediaRepo.saveFolder(folder);
    return MediaMapper.toFolderResponse(saved);
  }

  async upload(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    workspaceId: string,
    userId: string,
    folderId?: string,
  ): Promise<MediaAssetResponseDto> {
    this.validationService.validateFile(originalFilename, mimeType, fileBuffer.length);

    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const existing = await this.mediaRepo.findByChecksum(checksum, workspaceId);
    if (existing) {
      return MediaMapper.toAssetResponse(existing);
    }

    const key = `workspaces/${workspaceId}/assets/${checksum}-${originalFilename}`;
    const publicUrl = `https://cdn.jnsmarketing.org/${key}`;
    const dotIndex = originalFilename.lastIndexOf('.');
    const extension = originalFilename.substring(dotIndex).toLowerCase();

    const now = this.clockProvider.now();
    const isImage = mimeType.startsWith('image/');
    const asset: MediaAsset = {
      id: '',
      workspaceId,
      folderId: folderId || null,
      type: isImage ? 'IMAGE' : 'VIDEO',
      name: originalFilename,
      originalFilename,
      mimeType,
      extension,
      size: fileBuffer.length,
      width: null,
      height: null,
      duration: null,
      storageProvider: 'MOCK',
      storageKey: key,
      publicUrl,
      thumbnailUrl: isImage ? publicUrl : null,
      metaImageHash: null,
      metaVideoId: null,
      processingStatus: isImage ? 'COMPLETED' : 'PENDING',
      uploadStatus: 'PENDING',
      checksum,
      metadata: {},
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const savedAsset = await this.mediaRepo.saveAsset(asset);

    const connection = await this.connectionRepo.findByWorkspaceId(workspaceId);
    if (connection && connection.status === 'ACTIVE') {
      const token = this.encryptionService.decrypt(connection.encryptedAccessToken);
      if (token) {
        const accounts = await this.adAccountRepo.findByWorkspaceId(workspaceId);
        const activeAccount = accounts.find((a) => a.status === 'ACTIVE');
        if (activeAccount) {
          try {
            if (isImage) {
              const res = await this.uploader.uploadImage(
                fileBuffer,
                originalFilename,
                mimeType,
                token,
                activeAccount.externalId,
              );
              savedAsset.metaImageHash = res.metaImageHash || null;
              savedAsset.uploadStatus = 'UPLOADED';
              savedAsset.metadata = res.rawResponse;
            } else {
              const res = await this.uploader.uploadVideo(
                fileBuffer,
                originalFilename,
                mimeType,
                token,
                activeAccount.externalId,
              );
              savedAsset.metaVideoId = res.metaVideoId || null;
              savedAsset.uploadStatus = 'UPLOADED';
              savedAsset.processingStatus = 'PROCESSING';
              savedAsset.metadata = res.rawResponse;
            }
            await this.mediaRepo.saveAsset(savedAsset);
          } catch (err) {
            savedAsset.uploadStatus = 'FAILED';
            await this.mediaRepo.saveAsset(savedAsset);
          }
        }
      }
    }

    await this.historyService.createSnapshot(savedAsset, userId, 1);
    return MediaMapper.toAssetResponse(savedAsset);
  }

  async getFolders(workspaceId: string): Promise<MediaFolderResponseDto[]> {
    const folders = await this.mediaRepo.findFoldersByWorkspaceId(workspaceId);
    return folders.map(MediaMapper.toFolderResponse);
  }

  async getAssets(workspaceId: string): Promise<MediaAssetResponseDto[]> {
    const assets = await this.mediaRepo.findByWorkspaceId(workspaceId);
    return assets.map(MediaMapper.toAssetResponse);
  }

  async deleteAsset(id: string, workspaceId: string): Promise<void> {
    const asset = await this.mediaRepo.findById(id);
    if (!asset || asset.workspaceId !== workspaceId) {
      throw new NotFoundException('Media Asset not found');
    }
    asset.deletedAt = this.clockProvider.now();
    await this.mediaRepo.saveAsset(asset);
  }

  async deleteFolder(id: string, workspaceId: string): Promise<void> {
    const folder = await this.mediaRepo.findFolderById(id);
    if (!folder || folder.workspaceId !== workspaceId) {
      throw new NotFoundException('Media Folder not found');
    }
    folder.deletedAt = this.clockProvider.now();
    await this.mediaRepo.saveFolder(folder);
  }
}
