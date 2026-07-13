import { Injectable, Inject } from '@nestjs/common';
import { ICircuitBreaker } from '../../domain/ports/circuit-breaker.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { randomUUID } from 'crypto';

@Injectable()
export class CircuitBreakerService implements ICircuitBreaker {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
  ) {}

  async checkCallAllowed(provider: string, accountId: string, workspaceId: string): Promise<boolean> {
    const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
    if (breaker.status === 'CLOSED') {
      return true;
    }

    if (breaker.status === 'OPEN') {
      const now = new Date();
      if (breaker.nextAttemptAt && breaker.nextAttemptAt <= now) {
        await this.prisma.automationCircuitBreaker.update({
          where: { id: breaker.id },
          data: { status: 'HALF_OPEN' },
        });
        await this.publishEvent('Circuit Breaker Half Open', workspaceId, breaker.id, { provider, accountId });
        return true;
      }
      return false;
    }

    return true;
  }

  async recordSuccess(provider: string, accountId: string, workspaceId: string): Promise<void> {
    const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
    if (breaker.status !== 'CLOSED') {
      await this.prisma.automationCircuitBreaker.update({
        where: { id: breaker.id },
        data: {
          status: 'CLOSED',
          failureCount: 0,
          nextAttemptAt: null,
        },
      });
      await this.publishEvent('Circuit Breaker Closed', workspaceId, breaker.id, { provider, accountId });
    }
  }

  async recordFailure(provider: string, accountId: string, workspaceId: string): Promise<void> {
    const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
    const newFailCount = breaker.failureCount + 1;

    if (newFailCount >= breaker.failureThreshold) {
      const now = new Date();
      const nextAttempt = new Date(now.getTime() + breaker.recoveryTimeoutMs);

      await this.prisma.automationCircuitBreaker.update({
        where: { id: breaker.id },
        data: {
          status: 'OPEN',
          failureCount: newFailCount,
          lastFailureAt: now,
          nextAttemptAt: nextAttempt,
        },
      });
      await this.publishEvent('Circuit Breaker Opened', workspaceId, breaker.id, { provider, accountId, nextAttemptAt: nextAttempt });
    } else {
      await this.prisma.automationCircuitBreaker.update({
        where: { id: breaker.id },
        data: { failureCount: newFailCount, lastFailureAt: new Date() },
      });
    }
  }

  async resetBreaker(provider: string, accountId: string, workspaceId: string): Promise<void> {
    const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
    await this.prisma.automationCircuitBreaker.update({
      where: { id: breaker.id },
      data: {
        status: 'CLOSED',
        failureCount: 0,
        nextAttemptAt: null,
      },
    });
    await this.publishEvent('Circuit Breaker Closed', workspaceId, breaker.id, { provider, accountId });
  }

  async getBreakerState(provider: string, accountId: string, workspaceId: string): Promise<string> {
    const breaker = await this.getOrCreateBreaker(provider, accountId, workspaceId);
    return breaker.status;
  }

  private async getOrCreateBreaker(provider: string, accountId: string, workspaceId: string) {
    const existing = await this.prisma.automationCircuitBreaker.findFirst({
      where: { provider, providerAccountId: accountId, workspaceId },
    });
    if (existing) {
      return existing;
    }
    return await this.prisma.automationCircuitBreaker.create({
      data: {
        provider,
        providerAccountId: accountId,
        workspaceId,
        status: 'CLOSED',
      },
    });
  }

  private async publishEvent(name: string, workspaceId: string, causationId: string, payload: any) {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload: {
        entityId: causationId,
        ...payload,
      },
      triggerVersion: '1.0',
      source: 'Circuit Breaker',
      correlationId: randomUUID(),
      causationId,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
