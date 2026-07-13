import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDeadLetterStore } from '../../domain/ports/dead-letter-store.interface';
import { IRetryQueue } from '../../domain/ports/retry-queue.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class DeadLetterStoreService implements IDeadLetterStore {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject('IRetryQueue')
    private readonly retryQueue: IRetryQueue,
  ) {}

  async storeDeadLetter(
    workspaceId: string,
    provider: string,
    eventName: string,
    payload: any,
    correlationId: string,
    causationId: string,
    reason: string,
    retryCount: number,
  ): Promise<string> {
    const record = await this.prisma.automationDeadLetter.create({
      data: {
        workspaceId,
        provider,
        eventName,
        payload: payload || {},
        correlationId,
        causationId,
        reason,
        retryCount,
      },
    });

    await this.publishEvent('Dead Letter Created', workspaceId, correlationId, {
      deadLetterId: record.id,
      reason,
    });

    return record.id;
  }

  async replayDeadLetter(id: string): Promise<void> {
    const record = await this.prisma.automationDeadLetter.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException(`Dead letter record ${id} not found.`);
    }

    await this.retryQueue.enqueue({
      correlationId: record.correlationId,
      workspaceId: record.workspaceId,
      provider: record.provider,
      providerAccountId: (record.payload as any)?.providerAccountId || 'default',
      executionId: record.causationId,
      actionId: (record.payload as any)?.actionId || undefined,
      retryCount: 0,
      maxRetries: 5,
      firstFailureAt: new Date(),
      lastFailureAt: new Date(),
      retryPolicy: 'EXPONENTIAL',
      payload: record.payload,
    }, 'HIGH');

    await this.publishEvent('Dead Letter Replayed', record.workspaceId, record.correlationId, {
      deadLetterId: record.id,
    });
  }

  private async publishEvent(name: string, workspaceId: string, correlationId: string, payload: any) {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload: {
        entityId: correlationId,
        ...payload,
      },
      triggerVersion: '1.0',
      source: 'Dead Letter Store',
      correlationId,
      causationId: randomUUID(),
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
