import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { RecommendationEngineService } from './recommendation-engine.service';
import { RecommendationScoreService } from './recommendation-score.service';
export declare class RecommendationHistoryService {
    private readonly prisma;
    private readonly eventBus;
    private readonly engine;
    private readonly scoreService;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus, engine: RecommendationEngineService, scoreService: RecommendationScoreService);
    accept(workspaceId: string, id: string, userId?: string): Promise<void>;
    reject(workspaceId: string, id: string, userId?: string): Promise<void>;
    ignore(workspaceId: string, id: string, userId?: string): Promise<void>;
    private updateStatus;
    private publishEvent;
}
