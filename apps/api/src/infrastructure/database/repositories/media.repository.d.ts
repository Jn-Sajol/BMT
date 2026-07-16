import { MediaAsset, MediaFolder, MediaHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MediaRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<MediaAsset | null>;
    findByWorkspaceId(workspaceId: string): Promise<MediaAsset[]>;
    findByChecksum(checksum: string, workspaceId: string): Promise<MediaAsset | null>;
    findFolderById(id: string): Promise<MediaFolder | null>;
    findFoldersByWorkspaceId(workspaceId: string): Promise<MediaFolder[]>;
    saveFolder(entity: MediaFolder): Promise<MediaFolder>;
    saveAsset(entity: MediaAsset, tags?: string[]): Promise<MediaAsset>;
    saveHistory(history: MediaHistory): Promise<MediaHistory>;
    findHistoryByAssetId(mediaAssetId: string): Promise<MediaHistory[]>;
}
