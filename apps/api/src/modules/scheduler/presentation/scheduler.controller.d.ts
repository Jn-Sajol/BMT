import { JobQueue } from '../application/services/job-queue.service';
export declare class SchedulerController {
    private readonly jobQueue;
    constructor(jobQueue: JobQueue);
    triggerJob(jobId: string): Promise<{
        success: boolean;
    }>;
    cancelJob(jobId: string): Promise<{
        success: boolean;
    }>;
}
