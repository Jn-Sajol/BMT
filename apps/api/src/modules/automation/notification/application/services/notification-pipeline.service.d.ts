import { OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { TemplateEngineService } from './template-engine.service';
import { ProviderRegistryService } from './provider-registry.service';
import { NotificationPreferenceService } from './notification-preference.service';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
export declare class NotificationPipelineService implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
    private readonly eventBus;
    private readonly templates;
    private readonly providers;
    private readonly preferences;
    private readonly prisma;
    private workerTimer?;
    private isShuttingDown;
    constructor(eventBus: IEventBus, templates: TemplateEngineService, providers: ProviderRegistryService, preferences: NotificationPreferenceService, prisma: ExtendedPrismaClient);
    onModuleInit(): void;
    onApplicationBootstrap(): void;
    onApplicationShutdown(): void;
    handleEvent(event: DomainEvent): Promise<void>;
    private processPendingDeliveries;
    private publishEvent;
}
