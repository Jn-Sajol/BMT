import { AdSetRepository } from '../../../infrastructure/database/repositories/ad-set.repository';
import { AdSetHistory, AdSet } from '@prisma/client';
export declare class AdSetHistoryService {
    private readonly adSetRepo;
    constructor(adSetRepo: AdSetRepository);
    createSnapshot(adSet: AdSet, authorId: string): Promise<AdSetHistory>;
    getHistory(adsetId: string): Promise<AdSetHistory[]>;
    getSnapshot(adsetId: string, version: number): Promise<AdSetHistory | null>;
}
