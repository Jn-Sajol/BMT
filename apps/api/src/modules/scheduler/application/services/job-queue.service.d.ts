import { IJobQueue } from '../ports/job-queue.interface';
import { JobRepository } from '../../../../infrastructure/database/repositories/job.repository';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
export declare class JobQueue implements IJobQueue {
    private readonly jobRepo;
    private readonly clockProvider;
    constructor(jobRepo: JobRepository, clockProvider: IClockProvider);
    enqueue(name: string, provider: string, payload: any, correlationId?: string, runAt?: Date): Promise<string>;
    enqueueCron(name: string, provider: string, payload: any, cron: string, correlationId?: string): Promise<string>;
    cancel(jobId: string): Promise<void>;
    triggerManual(jobId: string): Promise<void>;
}
