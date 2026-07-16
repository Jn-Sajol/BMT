import { ITriggerRegistry } from '../../domain/ports/trigger-registry.interface';
import { ITriggerResolver } from '../../domain/ports/trigger-resolver.interface';
import { IEventBus } from '../ports/event-bus.interface';
import { ExtendedPrismaClient } from '../../../../infrastructure/database/prisma-extensions';
export declare class TriggerEngine {
    private readonly registry;
    private readonly resolver;
    private readonly eventBus;
    private readonly prisma;
    private readonly logger;
    constructor(registry: ITriggerRegistry, resolver: ITriggerResolver, eventBus: IEventBus, prisma: ExtendedPrismaClient);
    processEvent(source: string, rawPayload: any, workspaceId: string, correlationId?: `${string}-${string}-${string}-${string}-${string}`, causationId?: `${string}-${string}-${string}-${string}-${string}`): Promise<{
        status: string;
        eventCount: number;
        error?: string;
    }>;
    replayEvents(eventIds: string[]): Promise<void>;
}
