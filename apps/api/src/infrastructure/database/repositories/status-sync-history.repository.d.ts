import { StatusSyncHistory } from '@prisma/client';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class StatusSyncHistoryRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<StatusSyncHistory | null>;
    findHistoryByWorkspaceId(workspaceId: string): Promise<StatusSyncHistory[]>;
    save(entity: StatusSyncHistory): Promise<StatusSyncHistory>;
}
