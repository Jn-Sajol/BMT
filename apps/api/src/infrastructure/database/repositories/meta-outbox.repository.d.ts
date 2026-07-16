import { ExtendedPrismaClient } from '../prisma-extensions';
import { MetaOutboxJob } from '@prisma/client';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
export declare class MetaOutboxRepository {
    private readonly prisma;
    private readonly clockProvider;
    constructor(prisma: ExtendedPrismaClient, clockProvider: IClockProvider);
    createJob(jobData: Omit<MetaOutboxJob, 'id' | 'status' | 'attempts' | 'processedAt' | 'completedAt' | 'failedAt' | 'lastError' | 'createdAt' | 'updatedAt'>): Promise<MetaOutboxJob>;
    loadJob(id: string, workspaceId: string): Promise<MetaOutboxJob | null>;
    findPendingJobs(limit?: number): Promise<MetaOutboxJob[]>;
    markProcessing(id: string, workspaceId: string): Promise<MetaOutboxJob>;
    markSuccess(id: string, workspaceId: string): Promise<MetaOutboxJob>;
    markFailed(id: string, workspaceId: string, error: string, nextRunAt: Date): Promise<MetaOutboxJob>;
    moveDeadLetter(id: string, workspaceId: string, error: string): Promise<MetaOutboxJob>;
    cancelJob(id: string, workspaceId: string): Promise<MetaOutboxJob>;
}
