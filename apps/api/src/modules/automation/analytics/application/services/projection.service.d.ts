import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { EventUpcasterRegistry } from '../upcasters/event-upcaster.registry';
export declare class ProjectionService {
    private readonly prisma;
    private readonly upcasterRegistry;
    constructor(prisma: ExtendedPrismaClient, upcasterRegistry: EventUpcasterRegistry);
    projectEvent(event: DomainEvent): Promise<void>;
    rebuildProjections(workspaceId: string): Promise<void>;
    private updateAggregatedStats;
    private getPeriodsTimestamps;
}
