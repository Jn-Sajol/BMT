import { IDeadLetterStore } from '../../domain/ports/dead-letter-store.interface';
import { IRetryQueue } from '../../domain/ports/retry-queue.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class DeadLetterStoreService implements IDeadLetterStore {
    private readonly prisma;
    private readonly eventBus;
    private readonly retryQueue;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus, retryQueue: IRetryQueue);
    storeDeadLetter(workspaceId: string, provider: string, eventName: string, payload: any, correlationId: string, causationId: string, reason: string, retryCount: number): Promise<string>;
    replayDeadLetter(id: string): Promise<void>;
    private publishEvent;
}
