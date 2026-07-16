import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class TemplateAnalyticsService {
    private readonly prisma;
    private readonly eventBus;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    recordExecution(templateId: string, isSuccess: boolean, executionDurationMs: number): Promise<void>;
    private publishEvent;
}
