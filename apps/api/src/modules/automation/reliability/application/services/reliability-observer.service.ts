import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { FailureClassifier } from './failure-classifier.service';
import { RetryQueueService } from './retry-queue.service';
import { DeadLetterStoreService } from './dead-letter-store.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { RetryStrategyRegistry } from './retry-strategies';
import { RetryContext } from '../../domain/ports/retry-strategy.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';

@Injectable()
export class ReliabilityObserver implements OnModuleInit {
  constructor(
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    private readonly classifier: FailureClassifier,
    private readonly retryQueue: RetryQueueService,
    private readonly deadLetterStore: DeadLetterStoreService,
    private readonly breaker: CircuitBreakerService,
    private readonly retryRegistry: RetryStrategyRegistry,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe('*', this.handleEvent.bind(this));
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    const targetNames = ['Execution Completed', 'Action Completed', 'Rule Failed', 'Schedule Failed'];
    if (!targetNames.includes(event.name)) {
      return;
    }

    const payload = event.payload || {};
    const isFailed = payload.status === 'FAILED' || payload.error;
    const provider = payload.provider || 'Meta';
    const providerAccountId = payload.providerAccountId || 'default';

    if (!isFailed) {
      await this.breaker.recordSuccess(provider, providerAccountId, event.workspaceId);
      return;
    }

    try {
      const errorMsg = payload.error || 'Execution encountered transient error.';

      const classification = this.classifier.classifyFailure(new Error(errorMsg));

      await this.prisma.automationFailureHistory.create({
        data: {
          workspaceId: event.workspaceId,
          provider,
          classification: classification.category,
          severity: classification.severity,
          error: errorMsg,
          correlationId: event.correlationId,
        },
      });

      await this.breaker.recordFailure(provider, providerAccountId, event.workspaceId);

      const allowed = await this.breaker.checkCallAllowed(provider, providerAccountId, event.workspaceId);
      const retryCount = payload.retryCount || 0;
      const maxRetries = payload.maxRetries || 5;

      if (!allowed || !classification.retryable || retryCount >= maxRetries) {
        await this.deadLetterStore.storeDeadLetter(
          event.workspaceId,
          provider,
          event.name,
          payload,
          event.correlationId,
          event.causationId,
          allowed ? `Failure classified as non-retryable or max attempts hit (${retryCount}/${maxRetries}).` : 'Provider Circuit Breaker is currently OPEN.',
          retryCount,
        );
      } else {
        const strategy = this.retryRegistry.resolve(classification.recommendedPolicy);
        const retryCtx: RetryContext = {
          correlationId: event.correlationId,
          workspaceId: event.workspaceId,
          provider,
          providerAccountId,
          executionId: event.causationId,
          actionId: payload.actionId || undefined,
          retryCount: retryCount + 1,
          maxRetries,
          firstFailureAt: event.occurredAt,
          lastFailureAt: new Date(),
          retryPolicy: strategy.policyName,
          payload,
          nextRetryAt: undefined,
        };
        const nextRetryAt = strategy.calculateNextRetry(retryCtx);
        retryCtx.nextRetryAt = nextRetryAt;

        await this.retryQueue.enqueue(retryCtx, 'NORMAL');
      }
    } catch (err) {
      console.error('Passive Reliability Observer error handling event:', err);
    }
  }
}
