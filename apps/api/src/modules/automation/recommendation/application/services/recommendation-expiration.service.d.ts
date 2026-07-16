import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class RecommendationExpirationService implements OnApplicationBootstrap, OnApplicationShutdown {
    private readonly prisma;
    private readonly eventBus;
    private timer?;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    onApplicationBootstrap(): void;
    onApplicationShutdown(): void;
    sweepExpiredRecommendations(): Promise<void>;
    private publishEvent;
}
