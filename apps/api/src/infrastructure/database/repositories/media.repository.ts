import { Injectable, Inject } from '@nestjs/common';
import { MediaAsset, MediaFolder, MediaHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MediaRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<MediaAsset | null> {
    try {
      return await this.prisma.mediaAsset.findFirst({
        where: { id, deletedAt: null },
        include: { tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<MediaAsset[]> {
    try {
      return await this.prisma.mediaAsset.findMany({
        where: { workspaceId, deletedAt: null },
        include: { tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByChecksum(checksum: string, workspaceId: string): Promise<MediaAsset | null> {
    try {
      return await this.prisma.mediaAsset.findFirst({
        where: { checksum, workspaceId, deletedAt: null },
        include: { tags: true },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findFolderById(id: string): Promise<MediaFolder | null> {
    try {
      return await this.prisma.mediaFolder.findFirst({
        where: { id, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findFoldersByWorkspaceId(workspaceId: string): Promise<MediaFolder[]> {
    try {
      return await this.prisma.mediaFolder.findMany({
        where: { workspaceId, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveFolder(entity: MediaFolder): Promise<MediaFolder> {
    try {
      return await this.prisma.mediaFolder.upsert({
        where: { id: entity.id || '' },
        update: {
          name: entity.name,
          parentId: entity.parentId,
          deletedAt: entity.deletedAt,
        },
        create: {
          workspaceId: entity.workspaceId,
          parentId: entity.parentId,
          name: entity.name,
          deletedAt: entity.deletedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveAsset(entity: MediaAsset, tags: string[] = []): Promise<MediaAsset> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const saved = await tx.mediaAsset.upsert({
          where: { id: entity.id || '' },
          update: {
            folderId: entity.folderId,
            type: entity.type,
            name: entity.name,
            originalFilename: entity.originalFilename,
            mimeType: entity.mimeType,
            extension: entity.extension,
            size: entity.size,
            width: entity.width,
            height: entity.height,
            duration: entity.duration,
            storageProvider: entity.storageProvider,
            storageKey: entity.storageKey,
            publicUrl: entity.publicUrl,
            thumbnailUrl: entity.thumbnailUrl,
            metaImageHash: entity.metaImageHash,
            metaVideoId: entity.metaVideoId,
            processingStatus: entity.processingStatus,
            uploadStatus: entity.uploadStatus,
            checksum: entity.checksum,
            metadata: entity.metadata as any,
            deletedAt: entity.deletedAt,
          },
          create: {
            workspaceId: entity.workspaceId,
            folderId: entity.folderId,
            type: entity.type,
            name: entity.name,
            originalFilename: entity.originalFilename,
            mimeType: entity.mimeType,
            extension: entity.extension,
            size: entity.size,
            width: entity.width,
            height: entity.height,
            duration: entity.duration,
            storageProvider: entity.storageProvider,
            storageKey: entity.storageKey,
            publicUrl: entity.publicUrl,
            thumbnailUrl: entity.thumbnailUrl,
            metaImageHash: entity.metaImageHash,
            metaVideoId: entity.metaVideoId,
            processingStatus: entity.processingStatus,
            uploadStatus: entity.uploadStatus,
            checksum: entity.checksum,
            metadata: entity.metadata as any,
            createdBy: entity.createdBy,
            deletedAt: entity.deletedAt,
          },
        });

        await tx.mediaTag.deleteMany({ where: { mediaAssetId: saved.id } });
        if (tags.length > 0) {
          await tx.mediaTag.createMany({
            data: tags.map((name) => ({ mediaAssetId: saved.id, name })),
          });
        }

        return await tx.mediaAsset.findFirstOrThrow({
          where: { id: saved.id },
          include: { tags: true },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async saveHistory(history: MediaHistory): Promise<MediaHistory> {
    try {
      return await this.prisma.mediaHistory.create({
        data: {
          mediaAssetId: history.mediaAssetId,
          version: history.version,
          snapshot: history.snapshot as any,
          authorId: history.authorId,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByAssetId(mediaAssetId: string): Promise<MediaHistory[]> {
    try {
      return await this.prisma.mediaHistory.findMany({
        where: { mediaAssetId },
        orderBy: { version: 'desc' },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
