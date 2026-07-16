import { AdRepository } from '../../../infrastructure/database/repositories/ad.repository';
import { AdHistory, Ad } from '@prisma/client';
export declare class AdHistoryService {
    private readonly adRepo;
    constructor(adRepo: AdRepository);
    createSnapshot(ad: Ad, authorId: string): Promise<AdHistory>;
    getHistory(adId: string): Promise<AdHistory[]>;
    getSnapshot(adId: string, version: number): Promise<AdHistory | null>;
}
