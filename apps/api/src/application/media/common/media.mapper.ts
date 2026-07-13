import { MediaAsset, MediaFolder, MediaTag } from '@prisma/client';
import { MediaAssetResponseDto, MediaFolderResponseDto } from './media.dto';

export class MediaMapper {
  static toFolderResponse(entity: MediaFolder): MediaFolderResponseDto {
    return {
      id: entity.id,
      workspaceId: entity.workspaceId,
      parentId: entity.parentId || undefined,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toAssetResponse(
    entity: MediaAsset & { tags?: MediaTag[] },
  ): MediaAssetResponseDto {
    return {
      id: entity.id,
      workspaceId: entity.workspaceId,
      folderId: entity.folderId || undefined,
      type: entity.type,
      name: entity.name,
      originalFilename: entity.originalFilename,
      mimeType: entity.mimeType,
      extension: entity.extension,
      size: entity.size,
      width: entity.width || undefined,
      height: entity.height || undefined,
      duration: entity.duration || undefined,
      storageProvider: entity.storageProvider,
      storageKey: entity.storageKey,
      publicUrl: entity.publicUrl,
      thumbnailUrl: entity.thumbnailUrl || undefined,
      metaImageHash: entity.metaImageHash || undefined,
      metaVideoId: entity.metaVideoId || undefined,
      processingStatus: entity.processingStatus,
      uploadStatus: entity.uploadStatus,
      checksum: entity.checksum,
      metadata: entity.metadata,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      tags: entity.tags ? entity.tags.map((t) => t.name) : [],
    };
  }
}
