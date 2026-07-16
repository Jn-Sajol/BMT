import { CampaignInsight } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class CampaignInsightRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<CampaignInsight | null>;
    findByWorkspaceId(workspaceId: string): Promise<CampaignInsight[]>;
    upsert(entity: Omit<CampaignInsight, 'id'>): Promise<{
        insight: CampaignInsight;
        isNew: boolean;
    }>;
}
