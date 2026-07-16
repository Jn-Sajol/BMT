import { IRetryStrategy, RetryContext } from '../../domain/ports/retry-strategy.interface';
export declare class ImmediateRetryStrategy implements IRetryStrategy {
    policyName: string;
    calculateNextRetry(context: RetryContext): Date;
}
export declare class FixedDelayRetryStrategy implements IRetryStrategy {
    policyName: string;
    calculateNextRetry(context: RetryContext): Date;
}
export declare class LinearBackoffStrategy implements IRetryStrategy {
    policyName: string;
    calculateNextRetry(context: RetryContext): Date;
}
export declare class ExponentialBackoffStrategy implements IRetryStrategy {
    policyName: string;
    calculateNextRetry(context: RetryContext): Date;
}
export declare class ExponentialBackoffWithJitterStrategy implements IRetryStrategy {
    policyName: string;
    calculateNextRetry(context: RetryContext): Date;
}
export declare class RetryStrategyRegistry {
    private strategies;
    constructor();
    register(strategy: IRetryStrategy): void;
    resolve(policy: string): IRetryStrategy;
}
