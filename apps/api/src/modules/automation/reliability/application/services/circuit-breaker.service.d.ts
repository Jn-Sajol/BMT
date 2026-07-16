import { ICircuitBreaker } from '../../domain/ports/circuit-breaker.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class CircuitBreakerService implements ICircuitBreaker {
    private readonly prisma;
    private readonly eventBus;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    checkCallAllowed(provider: string, accountId: string, workspaceId: string): Promise<boolean>;
    recordSuccess(provider: string, accountId: string, workspaceId: string): Promise<void>;
    recordFailure(provider: string, accountId: string, workspaceId: string): Promise<void>;
    resetBreaker(provider: string, accountId: string, workspaceId: string): Promise<void>;
    getBreakerState(provider: string, accountId: string, workspaceId: string): Promise<string>;
    private getOrCreateBreaker;
    private publishEvent;
}
