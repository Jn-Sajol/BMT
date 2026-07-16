import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IScheduler } from '../../application/ports/scheduler.interface';
import { IJobWorker } from '../../application/ports/job-worker.interface';
import { JobRepository } from '../../../../infrastructure/database/repositories/job.repository';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
export declare class SchedulerEngine implements IScheduler, OnModuleInit, OnModuleDestroy {
    private readonly jobRepo;
    private readonly clockProvider;
    private readonly workers;
    private intervalId;
    private readonly instanceId;
    constructor(jobRepo: JobRepository, clockProvider: IClockProvider, workers?: IJobWorker[]);
    onModuleInit(): void;
    onModuleDestroy(): void;
    start(): void;
    stop(): void;
    private tick;
    private runJob;
}
