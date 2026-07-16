import { InsightSyncHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class InsightSyncHistoryRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<InsightSyncHistory | null>;
    findLatestByWorkspaceId(workspaceId: string): Promise<InsightSyncHistory | null>;
    save(entity: InsightSyncHistory): Promise<InsightSyncHistory>;
}
