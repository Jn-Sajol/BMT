import { Injectable, Inject, Logger } from '@nestjs/common';
import { ITriggerRegistry } from '../../domain/ports/trigger-registry.interface';
import { ITriggerResolver } from '../../domain/ports/trigger-resolver.interface';
import { IEventBus } from '../ports/event-bus.interface';
import { DomainEvent } from '../../domain/models/domain-event.model';
import { PRISMA_CLIENT } from '../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
import { randomUUID } from 'crypto';

@Injectable()
export class TriggerEngine {
  private readonly logger = new Logger(TriggerEngine.name);

  constructor(
    @Inject('ITriggerRegistry')
    private readonly registry: ITriggerRegistry,
    @Inject('ITriggerResolver')
    private readonly resolver: ITriggerResolver,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async processEvent(
    source: string,
    rawPayload: any,
    workspaceId: string,
    correlationId = randomUUID(),
    causationId = randomUUID(),
  ): Promise<{ status: string; eventCount: number; error?: string }> {
    const receivedAt = new Date();

    try {
      const provider = this.registry.getProviderForSource(source);
      if (!provider) {
        this.logger.warn(`No trigger provider found for source: ${source}`);
        await this.prisma.automationAuditLog.create({
          data: {
            ruleId: '00000000-0000-0000-0000-000000000000',
            versionId: '00000000-0000-0000-0000-000000000000',
            workspaceId,
            executionStatus: 'SKIPPED',
            triggerEvaluated: false,
            conditionsMatched: false,
            actionsTaken: [] as any,
            errorMessage: `No trigger provider found for source: ${source}`,
            ruleSnapshot: { rawPayload } as any,
          },
        });
        return { status: 'SKIPPED_UNSUPPORTED_SOURCE', eventCount: 0 };
      }

      const normalizedEvents = await provider.normalize(rawPayload, {
        workspaceId,
        correlationId,
        causationId,
        source,
        receivedAt,
      });

      let publishedCount = 0;
      for (const event of normalizedEvents) {
        const matchingRules = await this.resolver.resolveMatchingRules(event);

        if (matchingRules.length > 0) {
          await this.eventBus.publish(event);
          publishedCount++;
        }
      }

      return { status: 'COMPLETED', eventCount: publishedCount };
    } catch (err: any) {
      this.logger.error(`Failed to process trigger event: ${err.message}`, err.stack);
      try {
        await this.prisma.automationAuditLog.create({
          data: {
            ruleId: '00000000-0000-0000-0000-000000000000',
            versionId: '00000000-0000-0000-0000-000000000000',
            workspaceId,
            executionStatus: 'FAILED',
            triggerEvaluated: true,
            conditionsMatched: false,
            actionsTaken: [] as any,
            errorMessage: err.message,
            ruleSnapshot: { rawPayload } as any,
          },
        });
      } catch (logErr) {
        this.logger.error('Failed to log trigger failure audit log', logErr);
      }
      return { status: 'FAILED', eventCount: 0, error: err.message };
    }
  }

  async replayEvents(eventIds: string[]): Promise<void> {
    this.logger.log(`Replaying trigger events: ${eventIds.join(', ')}`);
  }
}
