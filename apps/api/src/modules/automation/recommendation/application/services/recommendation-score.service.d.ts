import { IScoreCalculator, ScoringInputs } from '../../domain/ports/score-calculator.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class RecommendationScoreService implements IScoreCalculator {
    private readonly prisma;
    private readonly eventBus;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    calculateScore(inputs: ScoringInputs): number;
    calculateAndSaveScore(workspaceId: string): Promise<any>;
    private publishEvent;
}
