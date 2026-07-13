import { Injectable } from '@nestjs/common';
import { AdSetRepository } from '../../../infrastructure/database/repositories/ad-set.repository';
import { AdSetHistory, AdSet } from '@prisma/client';

@Injectable()
export class AdSetHistoryService {
  constructor(private readonly adSetRepo: AdSetRepository) {}

  async createSnapshot(adSet: AdSet, authorId: string): Promise<AdSetHistory> {
    const history: AdSetHistory = {
      id: '',
      adsetId: adSet.id,
      version: adSet.draftVersion,
      snapshot: JSON.parse(JSON.stringify(adSet)),
      authorId,
      createdAt: new Date(),
    };
    return await this.adSetRepo.saveHistory(history);
  }

  async getHistory(adsetId: string): Promise<AdSetHistory[]> {
    return await this.adSetRepo.findHistoryByAdSetId(adsetId);
  }

  async getSnapshot(adsetId: string, version: number): Promise<AdSetHistory | null> {
    return await this.adSetRepo.findHistoryByAdSetIdAndVersion(adsetId, version);
  }
}
