import { Module } from '@nestjs/common';
import { FailureClassifier } from './application/services/failure-classifier.service';
import { RetryStrategyRegistry } from './application/services/retry-strategies';
import { CircuitBreakerService } from './application/services/circuit-breaker.service';
import { RetryQueueService } from './application/services/retry-queue.service';
import { DeadLetterStoreService } from './application/services/dead-letter-store.service';
import { ReliabilityObserver } from './application/services/reliability-observer.service';
import { RetryWorker } from './application/services/retry-worker.service';
import { ReliabilityController } from './presentation/reliability.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [ReliabilityController],
  providers: [
    FailureClassifier,
    RetryStrategyRegistry,
    CircuitBreakerService,
    RetryQueueService,
    DeadLetterStoreService,
    ReliabilityObserver,
    RetryWorker,
    {
      provide: 'IFailureClassifier',
      useClass: FailureClassifier,
    },
    {
      provide: 'ICircuitBreaker',
      useClass: CircuitBreakerService,
    },
    {
      provide: 'IRetryQueue',
      useClass: RetryQueueService,
    },
    {
      provide: 'IDeadLetterStore',
      useClass: DeadLetterStoreService,
    },
  ],
  exports: [
    FailureClassifier,
    RetryStrategyRegistry,
    CircuitBreakerService,
    RetryQueueService,
    DeadLetterStoreService,
    ReliabilityObserver,
    RetryWorker,
    'IFailureClassifier',
    'ICircuitBreaker',
    'IRetryQueue',
    'IDeadLetterStore',
  ],
})
export class ReliabilityModule {}
