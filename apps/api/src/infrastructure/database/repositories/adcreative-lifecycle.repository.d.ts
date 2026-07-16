import { ExtendedPrismaClient } from '../prisma-extensions';
import { AdCreative, AdCreativeLifecycleHistory } from '@prisma/client';
export declare class AdCreativeLifecycleRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<(AdCreative & {
        campaign: any;
    }) | null>;
    insertHistory(creativeId: string, action: string, beforeStatus: string, afterStatus: string, performedBy: string, performedAt: Date, metaResponse: any): Promise<AdCreativeLifecycleHistory>;
}
