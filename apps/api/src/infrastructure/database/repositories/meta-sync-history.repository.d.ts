import { MetaSyncHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class MetaSyncHistoryRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findLatestByWorkspaceId(workspaceId: string): Promise<MetaSyncHistory | null>;
    save(entity: MetaSyncHistory): Promise<MetaSyncHistory>;
}
