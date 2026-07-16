import { ISchedulerEngine } from '../../domain/ports/scheduler.interface';
import { ISchedulerLock } from '../../domain/ports/scheduler-lock.interface';
import { ITimezoneConverter } from '../../domain/ports/timezone-converter.interface';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class SchedulerEngine implements ISchedulerEngine {
    private readonly lockService;
    private readonly timezoneService;
    private readonly eventBus;
    private readonly prisma;
    constructor(lockService: ISchedulerLock, timezoneService: ITimezoneConverter, eventBus: IEventBus, prisma: ExtendedPrismaClient);
    triggerSchedule(scheduleId: string, nodeId: string): Promise<void>;
    pauseSchedule(scheduleId: string): Promise<void>;
    resumeSchedule(scheduleId: string): Promise<void>;
}
