import { Injectable, Inject } from '@nestjs/common';
import { IRetryQueue } from '../../domain/ports/retry-queue.interface';
import { RetryContext } from '../../domain/ports/retry-strategy.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID, createHash } from 'crypto';

@Injectable()
export class RetryQueueService implements IRetryQueue {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async enqueue(context: RetryContext, priority: 'HIGH' | 'NORMAL' | 'LOW' = 'NORMAL'): Promise<void> {
    const actionIdStr = context.actionId || 'noaction';
    const idempotencyKey = createHash('sha256')
      .update(`${context.correlationId}_${actionIdStr}_${context.retryCount}`)
      .digest('hex');

    const exists = await this.prisma.automationRetryQueue.findUnique({
      where: { idempotencyKey },
    });
    if (exists) {
      return;
    }

    try {
      await this.prisma.automationRetryQueue.create({
        data: {
          workspaceId: context.workspaceId,
          provider: context.provider,
          providerAccountId: context.providerAccountId,
          eventName: 'Retry Scheduled',
          payload: context.payload || {},
          correlationId: context.correlationId,
          causationId: context.executionId || randomUUID(),
          actionId: context.actionId || null,
          retryCount: context.retryCount,
          maxRetries: context.maxRetries,
          nextRetryAt: context.nextRetryAt || new Date(),
          status: 'PENDING',
          priority,
          idempotencyKey,
        },
      });

      await this.publishEvent('Retry Scheduled', context.workspaceId, context.correlationId, {
        correlationId: context.correlationId,
        idempotencyKey,
        attempt: context.retryCount,
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        return;
      }
      throw err;
    }
  }

  async dequeueNext(): Promise<RetryContext | undefined> {
    const now = new Date();

    const pending = await this.prisma.automationRetryQueue.findMany({
      where: {
        status: 'PENDING',
        nextRetryAt: { lte: now },
      },
      orderBy: [
        { nextRetryAt: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 20,
    });

    if (pending.length === 0) {
      return undefined;
    }

    const priorityWeight = (p: string) => (p === 'HIGH' ? 3 : p === 'LOW' ? 1 : 2);
    pending.sort((a, b) => {
      const timeDiff = a.nextRetryAt.getTime() - b.nextRetryAt.getTime();
      if (Math.abs(timeDiff) > 1000) {
        return timeDiff;
      }
      return priorityWeight(b.priority) - priorityWeight(a.priority);
    });

    const target = pending[0];

    const updated = await this.prisma.automationRetryQueue.updateMany({
      where: {
        id: target.id,
        status: 'PENDING',
      },
      data: {
        status: 'RUNNING',
      },
    });

    if (updated.count === 0) {
      return this.dequeueNext();
    }

    await this.publishEvent('Retry Started', target.workspaceId, target.correlationId, {
      correlationId: target.correlationId,
      idempotencyKey: target.idempotencyKey,
      attempt: target.retryCount,
    });

    return {
      correlationId: target.correlationId,
      workspaceId: target.workspaceId,
      provider: target.provider,
      providerAccountId: target.providerAccountId,
      executionId: target.causationId,
      actionId: target.actionId || undefined,
      retryCount: target.retryCount,
      maxRetries: target.maxRetries,
      firstFailureAt: target.createdAt,
      lastFailureAt: target.updatedAt,
      nextRetryAt: target.nextRetryAt,
      retryPolicy: 'RESOLVED',
      payload: target.payload,
    };
  }

  async completeRetry(idempotencyKey: string): Promise<void> {
    const item = await this.prisma.automationRetryQueue.findUnique({
      where: { idempotencyKey },
    });
    if (!item) return;

    await this.prisma.automationRetryQueue.update({
      where: { id: item.id },
      data: { status: 'COMPLETED' },
    });

    await this.publishEvent('Retry Completed', item.workspaceId, item.correlationId, {
      correlationId: item.correlationId,
      idempotencyKey,
    });
  }

  async failRetry(idempotencyKey: string, error: string): Promise<void> {
    const item = await this.prisma.automationRetryQueue.findUnique({
      where: { idempotencyKey },
    });
    if (!item) return;

    await this.prisma.automationRetryQueue.update({
      where: { id: item.id },
      data: { status: 'FAILED' },
    });

    await this.publishEvent('Retry Failed', item.workspaceId, item.correlationId, {
      correlationId: item.correlationId,
      idempotencyKey,
      error,
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
      source: 'Retry Queue',
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
