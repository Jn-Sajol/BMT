import { Injectable } from '@nestjs/common';
import { IRetryStrategy, RetryContext } from '../../domain/ports/retry-strategy.interface';

@Injectable()
export class ImmediateRetryStrategy implements IRetryStrategy {
  policyName = 'IMMEDIATE';
  calculateNextRetry(context: RetryContext): Date {
    return new Date();
  }
}

@Injectable()
export class FixedDelayRetryStrategy implements IRetryStrategy {
  policyName = 'FIXED';
  calculateNextRetry(context: RetryContext): Date {
    const delayMs = 5000;
    return new Date(Date.now() + delayMs);
  }
}

@Injectable()
export class LinearBackoffStrategy implements IRetryStrategy {
  policyName = 'LINEAR';
  calculateNextRetry(context: RetryContext): Date {
    const delayMs = context.retryCount * 5000;
    return new Date(Date.now() + delayMs);
  }
}

@Injectable()
export class ExponentialBackoffStrategy implements IRetryStrategy {
  policyName = 'EXPONENTIAL';
  calculateNextRetry(context: RetryContext): Date {
    const delayMs = Math.pow(2, context.retryCount) * 1000;
    return new Date(Date.now() + delayMs);
  }
}

@Injectable()
export class ExponentialBackoffWithJitterStrategy implements IRetryStrategy {
  policyName = 'EXPONENTIAL_JITTER';
  calculateNextRetry(context: RetryContext): Date {
    const baseDelay = Math.pow(2, context.retryCount) * 1000;
    const jitter = Math.random() * 500;
    return new Date(Date.now() + baseDelay + jitter);
  }
}

@Injectable()
export class RetryStrategyRegistry {
  private strategies = new Map<string, IRetryStrategy>();

  constructor() {
    this.register(new ImmediateRetryStrategy());
    this.register(new FixedDelayRetryStrategy());
    this.register(new LinearBackoffStrategy());
    this.register(new ExponentialBackoffStrategy());
    this.register(new ExponentialBackoffWithJitterStrategy());
  }

  register(strategy: IRetryStrategy): void {
    this.strategies.set(strategy.policyName.toUpperCase(), strategy);
  }

  resolve(policy: string): IRetryStrategy {
    const strategy = this.strategies.get(policy.toUpperCase());
    if (!strategy) {
      return this.strategies.get('EXPONENTIAL')!;
    }
    return strategy;
  }
}
