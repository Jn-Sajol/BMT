import { RetryContext } from './retry-strategy.interface';
export interface IRetryQueue {
    enqueue(context: RetryContext, priority?: 'HIGH' | 'NORMAL' | 'LOW'): Promise<void>;
    dequeueNext(): Promise<RetryContext | undefined>;
    completeRetry(idempotencyKey: string): Promise<void>;
    failRetry(idempotencyKey: string, error: string): Promise<void>;
}
