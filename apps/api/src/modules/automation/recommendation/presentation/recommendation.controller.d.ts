import { RecommendationHistoryService } from '../application/services/recommendation-history.service';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class RecommendationController {
    private readonly historyService;
    private readonly prisma;
    constructor(historyService: RecommendationHistoryService, prisma: ExtendedPrismaClient);
    getRecommendations(req: any): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        status: string;
        expiresAt: Date | null;
        workspaceId: string;
        provider: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        priority: string;
        explainability: import("@prisma/client/runtime/library").JsonValue;
        entityType: string;
        entityId: string;
        reason: string;
        recommendationType: string;
        title: string;
        confidenceScore: number;
        expectedImpact: string;
        recommendationHash: string;
    }[]>;
    getHistory(req: any): Promise<({
        recommendation: {
            description: string;
            id: string;
            createdAt: Date;
            status: string;
            expiresAt: Date | null;
            workspaceId: string;
            provider: string;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            priority: string;
            explainability: import("@prisma/client/runtime/library").JsonValue;
            entityType: string;
            entityId: string;
            reason: string;
            recommendationType: string;
            title: string;
            confidenceScore: number;
            expectedImpact: string;
            recommendationHash: string;
        };
    } & {
        id: string;
        status: string;
        recommendationId: string;
        actionBy: string | null;
        actionAt: Date;
    })[]>;
    getDashboard(req: any): Promise<{
        id: string;
        updatedAt: Date;
        workspaceId: string;
        potentialSavings: number;
        potentialRevenue: number;
        optimizationScore: number;
        automationHealth: number;
        acceptedCount: number;
        rejectedCount: number;
        pendingCount: number;
    } | {
        workspaceId: any;
        optimizationScore: number;
        automationHealth: number;
        potentialSavings: number;
        potentialRevenue: number;
        acceptedCount: number;
        rejectedCount: number;
        pendingCount: number;
    }>;
    getRecommendation(id: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        status: string;
        expiresAt: Date | null;
        workspaceId: string;
        provider: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        priority: string;
        explainability: import("@prisma/client/runtime/library").JsonValue;
        entityType: string;
        entityId: string;
        reason: string;
        recommendationType: string;
        title: string;
        confidenceScore: number;
        expectedImpact: string;
        recommendationHash: string;
    }>;
    acceptRecommendation(id: string, req: any): Promise<{
        success: boolean;
    }>;
    rejectRecommendation(id: string, req: any): Promise<{
        success: boolean;
    }>;
    ignoreRecommendation(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
