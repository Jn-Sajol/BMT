import { Injectable, Inject } from '@nestjs/common';
import { RecommendationProviderRegistry } from '../../infrastructure/registries/recommendation-provider.registry';
import { RecommendationExplainabilityService } from './recommendation-explainability.service';
import { PriorityEngineService } from './priority-engine.service';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID, createHash } from 'crypto';

@Injectable()
export class RecommendationEngineService {
  constructor(
    private readonly registry: RecommendationProviderRegistry,
    private readonly explainability: RecommendationExplainabilityService,
    private readonly priorityEngine: PriorityEngineService,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async evaluateAndGenerate(workspaceId: string): Promise<void> {
    const providers = this.registry.getAll();

    for (const provider of providers) {
      try {
        const rawRecommendations = await provider.generate(workspaceId);

        for (const raw of rawRecommendations) {
          const cpaDeviation = 1.8;
          const calculatedPriority = this.priorityEngine.calculatePriority(raw.confidenceScore, cpaDeviation);

          const metricWindow = '7d';
          const recommendationVersion = provider.providerVersion();
          const hashString = `${provider.providerName()}_${raw.entityId}_${raw.recommendationType}_${metricWindow}_${recommendationVersion}`;
          const recommendationHash = createHash('sha256').update(hashString).digest('hex');

          const existing = await this.prisma.automationRecommendation.findUnique({
            where: { recommendationHash },
          });
          if (existing) continue;

          const explainPayload = this.explainability.generatePayload(
            { currentCPA: raw.metadata?.currentCPA || 24.50 },
            { targetCPA: 20.00 },
            raw.description,
            raw.confidenceScore,
            raw.expectedImpact,
          );

          const rec = await this.prisma.automationRecommendation.create({
            data: {
              workspaceId,
              provider: provider.providerName(),
              recommendationType: raw.recommendationType,
              entityType: raw.entityType,
              entityId: raw.entityId,
              title: raw.title,
              description: raw.description,
              reason: raw.reason,
              confidenceScore: raw.confidenceScore,
              expectedImpact: raw.expectedImpact,
              priority: calculatedPriority,
              status: 'PENDING',
              recommendationHash,
              expiresAt: new Date(Date.now() + 86400000 * 3),
              metadata: raw.metadata || {},
              explainability: explainPayload as any,
            },
          });

          await this.prisma.automationRecommendationHistory.create({
            data: {
              recommendationId: rec.id,
              status: 'PENDING',
            },
          });

          await this.updateDashboardCounts(workspaceId);

          await this.publishEvent('Recommendation Generated', workspaceId, rec.id, {
            recommendationId: rec.id,
            recommendationHash,
          });
        }
      } catch (err) {
        console.error(`Recommendation provider ${provider.providerName()} failed:`, err);
      }
    }
  }

  async updateDashboardCounts(workspaceId: string) {
    const pending = await this.prisma.automationRecommendation.count({
      where: { workspaceId, status: 'PENDING' },
    });
    const accepted = await this.prisma.automationRecommendation.count({
      where: { workspaceId, status: 'ACCEPTED' },
    });
    const rejected = await this.prisma.automationRecommendation.count({
      where: { workspaceId, status: 'REJECTED' },
    });

    await this.prisma.automationRecommendationDashboardProjection.upsert({
      where: { workspaceId },
      update: {
        pendingCount: pending,
        acceptedCount: accepted,
        rejectedCount: rejected,
        updatedAt: new Date(),
      },
      create: {
        workspaceId,
        pendingCount: pending,
        acceptedCount: accepted,
        rejectedCount: rejected,
        optimizationScore: 85.0,
        automationHealth: 90.0,
        potentialSavings: 350.0,
        potentialRevenue: 1200.0,
      },
    });
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
      source: 'Recommendation Engine',
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
