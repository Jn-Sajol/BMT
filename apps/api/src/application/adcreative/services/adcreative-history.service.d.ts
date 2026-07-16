import { AdCreativeRepository } from '../../../infrastructure/database/repositories/ad-creative.repository';
import { AdCreativeHistory, AdCreative } from '@prisma/client';
export declare class AdCreativeHistoryService {
    private readonly adCreativeRepo;
    constructor(adCreativeRepo: AdCreativeRepository);
    createSnapshot(adCreative: AdCreative, authorId: string): Promise<AdCreativeHistory>;
    getHistory(adCreativeId: string): Promise<AdCreativeHistory[]>;
    getSnapshot(adCreativeId: string, version: number): Promise<AdCreativeHistory | null>;
}
