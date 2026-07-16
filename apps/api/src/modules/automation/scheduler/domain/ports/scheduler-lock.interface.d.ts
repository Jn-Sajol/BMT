export interface ISchedulerLock {
    acquireLock(scheduleId: string, nodeId: string, leaseMs: number): Promise<boolean>;
    renewLock(scheduleId: string, nodeId: string, leaseMs: number): Promise<boolean>;
    releaseLock(scheduleId: string, nodeId: string): Promise<void>;
}
