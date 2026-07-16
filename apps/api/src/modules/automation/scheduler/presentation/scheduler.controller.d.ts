import { SchedulerEngine } from '../application/services/scheduler-engine.service';
import { SchedulerLoop } from '../application/services/scheduler-loop.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class SchedulerController {
    private readonly engine;
    private readonly loop;
    private readonly prisma;
    constructor(engine: SchedulerEngine, loop: SchedulerLoop, prisma: ExtendedPrismaClient);
    getSchedules(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workspaceId: string;
        timezone: string;
        provider: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ruleId: string;
        cronExpression: string | null;
        scheduleType: string;
        nextRunAtUtc: Date | null;
        lastRunAtUtc: Date | null;
        startDate: Date | null;
        endDate: Date | null;
    }[]>;
    getHistory(req: any): Promise<{
        error: string | null;
        id: string;
        status: string;
        workspaceId: string;
        startedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        correlationId: string;
        completedAt: Date | null;
        durationMs: number;
        retryCount: number;
        scheduleId: string;
        nodeId: string;
    }[]>;
    runNow(scheduleId: string): Promise<{
        success: boolean;
        triggeredBy: string;
    }>;
    pauseSchedule(scheduleId: string): Promise<{
        status: string;
    }>;
    resumeSchedule(scheduleId: string): Promise<{
        status: string;
    }>;
    checkHealth(): Promise<{
        status: string;
        currentNodeId: string;
        clusterSize: number;
    }>;
}
