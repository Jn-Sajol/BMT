import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class RecommendationExpirationService implements OnApplicationBootstrap, OnApplicationShutdown {
  private timer?: NodeJS.Timeout;

  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  onApplicationBootstrap() {
    this.timer = setInterval(() => this.sweepExpiredRecommendations(), 60000);
  }

  onApplicationShutdown() {
    if (this.timer) clearInterval(this.timer);
  }

  async sweepExpiredRecommendations() {
    const now = new Date();
    const expired = await this.prisma.automationRecommendation.findMany({
      where: {
        status: 'PENDING',
        expiresAt: { lte: now },
      },
    });

    for (const rec of expired) {
      await this.prisma.automationRecommendation.update({
        where: { id: rec.id },
        data: { status: 'EXPIRED' },
      });

      await this.prisma.automationRecommendationHistory.create({
        data: {
          recommendationId: rec.id,
          status: 'EXPIRED',
        },
      });

      await this.publishEvent('Recommendation Expired', rec.workspaceId, rec.id, { recommendationId: rec.id });
    }
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
