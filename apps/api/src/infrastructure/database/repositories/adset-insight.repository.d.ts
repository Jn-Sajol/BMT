import { AdSetInsight } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class AdSetInsightRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<AdSetInsight | null>;
    findByWorkspaceId(workspaceId: string): Promise<AdSetInsight[]>;
    upsert(entity: Omit<AdSetInsight, 'id'>): Promise<{
        insight: AdSetInsight;
        isNew: boolean;
    }>;
}
