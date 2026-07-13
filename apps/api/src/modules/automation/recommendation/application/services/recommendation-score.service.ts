import { Injectable, Inject } from '@nestjs/common';
import { IScoreCalculator, ScoringInputs } from '../../domain/ports/score-calculator.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class RecommendationScoreService implements IScoreCalculator {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  calculateScore(inputs: ScoringInputs): number {
    const weights = {
      performanceScore: 0.3,
      automationHealth: 0.2,
      reliabilityScore: 0.2,
      workflowHealth: 0.2,
      insightFreshness: 0.1,
    };

    return (
      inputs.performanceScore * weights.performanceScore +
      inputs.automationHealth * weights.automationHealth +
      inputs.reliabilityScore * weights.reliabilityScore +
      inputs.workflowHealth * weights.workflowHealth +
      inputs.insightFreshness * weights.insightFreshness
    );
  }

  async calculateAndSaveScore(workspaceId: string): Promise<any> {
    const inputs: ScoringInputs = {
      performanceScore: 88.0,
      automationHealth: 95.0,
      reliabilityScore: 92.0,
      workflowHealth: 90.0,
      insightFreshness: 100.0,
    };

    const optimizationScore = this.calculateScore(inputs);

    const scoreRecord = await this.prisma.automationOptimizationScore.create({
      data: {
        workspaceId,
        score: optimizationScore,
        healthScore: inputs.automationHealth,
        potentialSavings: 350.0,
        potentialRevenue: 1200.0,
      },
    });

    await this.prisma.automationRecommendationDashboardProjection.upsert({
      where: { workspaceId },
      update: {
        optimizationScore,
        automationHealth: inputs.automationHealth,
        potentialSavings: 350.0,
        potentialRevenue: 1200.0,
        updatedAt: new Date(),
      },
      create: {
        workspaceId,
        optimizationScore,
        automationHealth: inputs.automationHealth,
        potentialSavings: 350.0,
        potentialRevenue: 1200.0,
      },
    });

    await this.publishEvent('Optimization Score Updated', workspaceId, scoreRecord.id, {
      optimizationScore,
    });

    return scoreRecord;
  }

  private async publishEvent(name: string, workspaceId: string, causationId: string, payload: any) {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload: {
        entityId: causationId,
        ...payload,
      },
      triggerVersion: '1.0',
      source: 'Recommendation Score Service',
      correlationId: randomUUID(),
      causationId,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
