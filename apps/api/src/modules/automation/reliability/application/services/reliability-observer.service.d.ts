import { OnModuleInit } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { FailureClassifier } from './failure-classifier.service';
import { RetryQueueService } from './retry-queue.service';
import { DeadLetterStoreService } from './dead-letter-store.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { RetryStrategyRegistry } from './retry-strategies';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class ReliabilityObserver implements OnModuleInit {
    private readonly eventBus;
    private readonly classifier;
    private readonly retryQueue;
    private readonly deadLetterStore;
    private readonly breaker;
    private readonly retryRegistry;
    private readonly prisma;
    constructor(eventBus: IEventBus, classifier: FailureClassifier, retryQueue: RetryQueueService, deadLetterStore: DeadLetterStoreService, breaker: CircuitBreakerService, retryRegistry: RetryStrategyRegistry, prisma: ExtendedPrismaClient);
    onModuleInit(): void;
    handleEvent(event: DomainEvent): Promise<void>;
}
