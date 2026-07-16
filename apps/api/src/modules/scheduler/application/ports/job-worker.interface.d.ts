export interface IJobWorker {
    supports(jobName: string, provider: string): boolean;
    execute(payload: any, correlationId: string): Promise<void>;
}
