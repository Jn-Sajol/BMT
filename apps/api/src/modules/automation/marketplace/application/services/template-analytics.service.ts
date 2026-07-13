import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class TemplateAnalyticsService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async recordExecution(templateId: string, isSuccess: boolean, executionDurationMs: number): Promise<void> {
    const existing = await this.prisma.automationTemplateAnalytics.findFirst({
      where: { templateId },
    });

    const installs = existing?.installs || 0;
    const clones = existing?.clones || 0;
    const executions = (existing?.executions || 0) + 1;
    const rawSuccessRate = existing?.successRate || 1.0;
    const successRate = isSuccess
      ? (rawSuccessRate * (executions - 1) + 1.0) / executions
      : (rawSuccessRate * (executions - 1)) / executions;

    const roi = (existing?.averageRoi || 0.0) + (isSuccess ? 15.0 : 0.0);

    const targetId = existing?.id || randomUUID();

    await this.prisma.automationTemplateAnalytics.upsert({
      where: { id: targetId },
      update: {
        executions,
        successRate,
        averageRoi: roi,
      },
      create: {
        id: targetId,
        templateId,
        installs,
        clones,
        executions,
        successRate,
        averageRoi: roi,
      },
    });

    await this.publishEvent('TemplateAnalyticsUpdated', 'global', templateId, {
      templateId,
      executions,
      successRate,
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
      source: 'Marketplace Analytics Service',
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
