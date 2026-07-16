import { IInsightsProviderRegistry } from '../../domain/ports/insights-provider-registry.interface';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class InsightsCollectionEngine {
    private readonly registry;
    private readonly eventBus;
    private readonly prisma;
    constructor(registry: IInsightsProviderRegistry, eventBus: IEventBus, prisma: ExtendedPrismaClient);
    triggerSync(workspaceId: string, providerName: string, syncMode: 'FULL_SYNC' | 'INCREMENTAL_SYNC' | 'HISTORICAL_BACKFILL'): Promise<any>;
    private publishEvent;
}
