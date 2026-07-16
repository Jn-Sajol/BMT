import { MediaRepository } from '../../../infrastructure/database/repositories/media.repository';
import { MediaHistory, MediaAsset } from '@prisma/client';
export declare class MediaHistoryService {
    private readonly mediaRepo;
    constructor(mediaRepo: MediaRepository);
    createSnapshot(asset: MediaAsset, authorId: string, version: number): Promise<MediaHistory>;
    getHistory(mediaAssetId: string): Promise<MediaHistory[]>;
}
