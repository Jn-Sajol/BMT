import { OnModuleInit } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { ProjectionService } from './projection.service';
export declare class AnalyticsObserver implements OnModuleInit {
    private readonly eventBus;
    private readonly prisma;
    private readonly projectionService;
    constructor(eventBus: IEventBus, prisma: ExtendedPrismaClient, projectionService: ProjectionService);
    onModuleInit(): void;
    handleEvent(event: DomainEvent): Promise<void>;
}
