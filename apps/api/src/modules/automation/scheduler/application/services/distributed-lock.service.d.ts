import { ISchedulerLock } from '../../domain/ports/scheduler-lock.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class DistributedLockService implements ISchedulerLock {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    acquireLock(scheduleId: string, nodeId: string, leaseMs: number): Promise<boolean>;
    renewLock(scheduleId: string, nodeId: string, leaseMs: number): Promise<boolean>;
    releaseLock(scheduleId: string, nodeId: string): Promise<void>;
}
