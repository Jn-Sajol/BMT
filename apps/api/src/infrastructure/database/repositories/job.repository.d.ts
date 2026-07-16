import { ExtendedPrismaClient } from '../prisma-extensions';
import { Job, JobHistory } from '@prisma/client';
export declare class JobRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    createJob(name: string, provider: string, payload: any, cron: string | null, correlationId: string, runAt: Date): Promise<Job>;
    findPendingJobs(now: Date): Promise<Job[]>;
    updateJobStatus(id: string, status: string, attempts: number, errorMessage: string | null, runAt: Date, lastRunAt: Date | null): Promise<Job>;
    insertHistory(jobId: string, status: string, attempt: number, errorMessage: string | null, duration: number, startedAt: Date, finishedAt: Date): Promise<JobHistory>;
    cancelJob(id: string): Promise<Job>;
    findById(id: string): Promise<Job | null>;
    acquireLock(lockKey: string, lockedBy: string, durationSeconds: number): Promise<boolean>;
    releaseLock(lockKey: string, lockedBy: string): Promise<void>;
}
