import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { ProjectionService } from './projection.service';

@Injectable()
export class AnalyticsObserver implements OnModuleInit {
  constructor(
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    private readonly projectionService: ProjectionService,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    const targetNames = ['Trigger Matched', 'Rule Evaluated', 'Action Completed', 'Execution Completed'];
    if (!targetNames.includes(event.name)) {
      return;
    }

    try {
      await this.prisma.automationTimelineEvent.create({
        data: {
          eventName: event.name,
          workspaceId: event.workspaceId,
          correlationId: event.correlationId,
          causationId: event.causationId,
          payload: event.payload as any,
          schemaVersion: event.triggerVersion || '1.0',
          eventVersion: event.eventVersion || '1.0',
          createdAt: event.occurredAt || new Date(),
        },
      });

      await this.projectionService.projectEvent(event);
    } catch (err) {
      console.error('Passive Analytics Observer error processing event:', err);
    }
  }
}
