import { RecommendationProviderRegistry } from '../../infrastructure/registries/recommendation-provider.registry';
import { RecommendationExplainabilityService } from './recommendation-explainability.service';
import { PriorityEngineService } from './priority-engine.service';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class RecommendationEngineService {
    private readonly registry;
    private readonly explainability;
    private readonly priorityEngine;
    private readonly prisma;
    private readonly eventBus;
    constructor(registry: RecommendationProviderRegistry, explainability: RecommendationExplainabilityService, priorityEngine: PriorityEngineService, prisma: ExtendedPrismaClient, eventBus: IEventBus);
    evaluateAndGenerate(workspaceId: string): Promise<void>;
    updateDashboardCounts(workspaceId: string): Promise<void>;
    private publishEvent;
}
