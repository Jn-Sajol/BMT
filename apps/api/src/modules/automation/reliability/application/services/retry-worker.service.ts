import { Injectable, OnApplicationBootstrap, OnApplicationShutdown, Inject } from '@nestjs/common';
import { RetryQueueService } from './retry-queue.service';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID, createHash } from 'crypto';

@Injectable()
export class RetryWorker implements OnApplicationBootstrap, OnApplicationShutdown {
  private pollTimer?: NodeJS.Timeout;
  private isShuttingDown = false;
  private workerId = `worker-${randomUUID()}`;

  constructor(
    private readonly queue: RetryQueueService,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  onApplicationBootstrap() {
    this.isShuttingDown = false;
    this.pollTimer = setInterval(() => this.processNextRetry(), 5000);
  }

  onApplicationShutdown() {
    this.isShuttingDown = true;
    if (this.pollTimer) clearInterval(this.pollTimer);
  }

  private async processNextRetry() {
    if (this.isShuttingDown) return;

    try {
      const context = await this.queue.dequeueNext();
      if (!context) return;

      const actionIdStr = context.actionId || 'noaction';
      const attemptStr = String(context.retryCount);
      
      const idempotencyKey = createHash('sha256')
        .update(`${context.correlationId}_${actionIdStr}_${attemptStr}`)
        .digest('hex');

      try {
        const start = Date.now();

        const event: DomainEvent = {
          id: randomUUID(),
          name: 'Retry Triggered',
          workspaceId: context.workspaceId,
          payload: {
            ...context.payload,
            retryCount: context.retryCount,
            idempotencyKey,
            workerId: this.workerId,
          },
          triggerVersion: '1.0',
          source: 'Retry Worker',
          correlationId: context.correlationId,
          causationId: context.executionId || randomUUID(),
          occurredAt: new Date(),
          receivedAt: new Date(),
          processedAt: new Date(),
          timestamp: new Date(),
        };

        await this.eventBus.publish(event);

        await this.queue.completeRetry(idempotencyKey);
      } catch (err: any) {
        await this.queue.failRetry(idempotencyKey, err.message);
      }
    } catch {
      // Resilient pass
    }
  }

  getWorkerId() {
    return this.workerId;
  }
}
