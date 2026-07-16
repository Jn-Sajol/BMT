import { IRetryQueue } from '../../domain/ports/retry-queue.interface';
import { RetryContext } from '../../domain/ports/retry-strategy.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class RetryQueueService implements IRetryQueue {
    private readonly prisma;
    private readonly eventBus;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    enqueue(context: RetryContext, priority?: 'HIGH' | 'NORMAL' | 'LOW'): Promise<void>;
    dequeueNext(): Promise<RetryContext | undefined>;
    completeRetry(idempotencyKey: string): Promise<void>;
    failRetry(idempotencyKey: string, error: string): Promise<void>;
    private publishEvent;
}
