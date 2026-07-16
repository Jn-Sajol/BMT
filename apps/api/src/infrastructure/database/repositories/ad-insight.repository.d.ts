import { AdInsight } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class AdInsightRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<AdInsight | null>;
    findByWorkspaceId(workspaceId: string): Promise<AdInsight[]>;
    upsert(entity: Omit<AdInsight, 'id'>): Promise<{
        insight: AdInsight;
        isNew: boolean;
    }>;
}
