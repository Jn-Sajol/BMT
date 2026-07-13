import { Injectable } from '@nestjs/common';
import { AdCreativeRepository } from '../../../infrastructure/database/repositories/ad-creative.repository';
import { AdCreativeHistory, AdCreative } from '@prisma/client';

@Injectable()
export class AdCreativeHistoryService {
  constructor(private readonly adCreativeRepo: AdCreativeRepository) {}

  async createSnapshot(adCreative: AdCreative, authorId: string): Promise<AdCreativeHistory> {
    const history: AdCreativeHistory = {
      id: '',
      adCreativeId: adCreative.id,
      version: adCreative.draftVersion,
      snapshot: JSON.parse(JSON.stringify(adCreative)),
      authorId,
      createdAt: new Date(),
    };
    return await this.adCreativeRepo.saveHistory(history);
  }

  async getHistory(adCreativeId: string): Promise<AdCreativeHistory[]> {
    return await this.adCreativeRepo.findHistoryByAdCreativeId(adCreativeId);
  }

  async getSnapshot(adCreativeId: string, version: number): Promise<AdCreativeHistory | null> {
    return await this.adCreativeRepo.findHistoryByAdCreativeIdAndVersion(adCreativeId, version);
  }
}
