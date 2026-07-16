export interface IJobQueue {
    enqueue(name: string, provider: string, payload: any, correlationId?: string, runAt?: Date): Promise<string>;
    enqueueCron(name: string, provider: string, payload: any, cron: string, correlationId?: string): Promise<string>;
    cancel(jobId: string): Promise<void>;
    triggerManual(jobId: string): Promise<void>;
}
