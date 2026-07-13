import { Injectable } from '@nestjs/common';
import { AdRepository } from '../../../infrastructure/database/repositories/ad.repository';
import { AdHistory, Ad } from '@prisma/client';

@Injectable()
export class AdHistoryService {
  constructor(private readonly adRepo: AdRepository) {}

  async createSnapshot(ad: Ad, authorId: string): Promise<AdHistory> {
    const history: AdHistory = {
      id: '',
      adId: ad.id,
      version: ad.draftVersion,
      snapshot: JSON.parse(JSON.stringify(ad)),
      authorId,
      createdAt: new Date(),
    };
    return await this.adRepo.saveHistory(history);
  }

  async getHistory(adId: string): Promise<AdHistory[]> {
    return await this.adRepo.findHistoryByAdId(adId);
  }

  async getSnapshot(adId: string, version: number): Promise<AdHistory | null> {
    return await this.adRepo.findHistoryByAdIdAndVersion(adId, version);
  }
}
