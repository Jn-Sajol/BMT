import { ProjectionService } from '../application/services/projection.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class AnalyticsController {
    private readonly projectionService;
    private readonly prisma;
    constructor(projectionService: ProjectionService, prisma: ExtendedPrismaClient);
    getTimeline(workspaceId: string): Promise<{
        id: string;
        createdAt: Date;
        workspaceId: string;
        provider: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        correlationId: string;
        causationId: string;
        schemaVersion: string;
        eventName: string;
        eventVersion: string;
    }[]>;
    getRulePerformance(workspaceId: string): Promise<{
        name: string;
        id: string;
        workspaceId: string;
        ruleId: string;
        executionsCount: number;
        successCount: number;
        failedCount: number;
        lastExecutedAt: Date | null;
        averageDurationMs: number;
    }[]>;
    getActionPerformance(workspaceId: string): Promise<{
        id: string;
        workspaceId: string;
        executionsCount: number;
        successCount: number;
        failedCount: number;
        averageDurationMs: number;
        actionType: string;
    }[]>;
    getTriggerPerformance(workspaceId: string): Promise<{
        id: string;
        workspaceId: string;
        triggerType: string;
        matchedCount: number;
        lastMatchedAt: Date | null;
    }[]>;
    getExecutionPerformance(workspaceId: string): Promise<{
        id: string;
        status: string;
        workspaceId: string;
        startedAt: Date;
        correlationId: string;
        completedAt: Date | null;
        ruleId: string;
        durationMs: number;
    }[]>;
    getAggregates(workspaceId: string, period?: string): Promise<{
        id: string;
        workspaceId: string;
        ruleId: string | null;
        executionsCount: number;
        successCount: number;
        failedCount: number;
        averageDurationMs: number;
        period: string;
        timestamp: Date;
    }[]>;
    rebuildProjections(workspaceId: string): Promise<{
        status: string;
        message: string;
    }>;
}
