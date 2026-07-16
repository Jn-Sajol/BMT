import { InsightsCollectionEngine } from '../application/services/insights-collection-engine.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class InsightsController {
    private readonly engine;
    private readonly prisma;
    constructor(engine: InsightsCollectionEngine, prisma: ExtendedPrismaClient);
    getSyncStatus(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        provider: string;
        syncMode: string;
        lastSuccessfulSyncAt: Date | null;
        syncCursor: string | null;
        pageCursor: string | null;
        checkpoint: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    fullSync(provider: string, req: any): Promise<any>;
    incrementalSync(provider: string, req: any): Promise<any>;
    backfill(provider: string, req: any): Promise<any>;
    getHistory(req: any): Promise<{
        id: string;
        status: string;
        workspaceId: string;
        provider: string;
        startedAt: Date;
        finishedAt: Date | null;
        errorMessage: string | null;
        syncMode: string;
        pagesCollected: number;
        rowsNormalized: number;
        rowsInserted: number;
        duplicatesSkipped: number;
        retryCount: number;
        apiLatencyMs: number;
    }[]>;
}
