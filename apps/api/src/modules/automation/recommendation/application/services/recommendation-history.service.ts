import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { RecommendationEngineService } from './recommendation-engine.service';
import { RecommendationScoreService } from './recommendation-score.service';
import { randomUUID } from 'crypto';

@Injectable()
export class RecommendationHistoryService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    private readonly engine: RecommendationEngineService,
    private readonly scoreService: RecommendationScoreService,
  ) {}

  async accept(workspaceId: string, id: string, userId?: string): Promise<void> {
    await this.updateStatus(workspaceId, id, 'ACCEPTED', 'Recommendation Accepted', userId);
  }

  async reject(workspaceId: string, id: string, userId?: string): Promise<void> {
    await this.updateStatus(workspaceId, id, 'REJECTED', 'Recommendation Rejected', userId);
  }

  async ignore(workspaceId: string, id: string, userId?: string): Promise<void> {
    await this.updateStatus(workspaceId, id, 'IGNORED', 'Recommendation Ignored', userId);
  }

  private async updateStatus(
    workspaceId: string,
    id: string,
    status: string,
    eventName: string,
    userId?: string,
  ): Promise<void> {
    const rec = await this.prisma.automationRecommendation.findUnique({
      where: { id },
    });
    if (!rec) {
      throw new NotFoundException(`Recommendation ${id} not found.`);
    }

    await this.prisma.automationRecommendation.update({
      where: { id },
      data: { status },
    });

    await this.prisma.automationRecommendationHistory.create({
      data: {
        recommendationId: id,
        status,
        actionBy: userId || null,
      },
    });

    await this.engine.updateDashboardCounts(workspaceId);
    await this.scoreService.calculateAndSaveScore(workspaceId);

    await this.publishEvent(eventName, workspaceId, id, { recommendationId: id });
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
      source: 'Recommendation History Service',
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
