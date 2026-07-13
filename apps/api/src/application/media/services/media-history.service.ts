import { Injectable } from '@nestjs/common';
import { MediaRepository } from '../../../infrastructure/database/repositories/media.repository';
import { MediaHistory, MediaAsset } from '@prisma/client';

@Injectable()
export class MediaHistoryService {
  constructor(private readonly mediaRepo: MediaRepository) {}

  async createSnapshot(asset: MediaAsset, authorId: string, version: number): Promise<MediaHistory> {
    const history: MediaHistory = {
      id: '',
      mediaAssetId: asset.id,
      version,
      snapshot: JSON.parse(JSON.stringify(asset)),
      authorId,
      createdAt: new Date(),
    };
    return await this.mediaRepo.saveHistory(history);
  }

  async getHistory(mediaAssetId: string): Promise<MediaHistory[]> {
    return await this.mediaRepo.findHistoryByAssetId(mediaAssetId);
  }
}
