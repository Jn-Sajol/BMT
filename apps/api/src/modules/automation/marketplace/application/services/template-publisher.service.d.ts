import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class TemplatePublisherService {
    private readonly prisma;
    private readonly eventBus;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    publish(workspaceId: string, authorId: string, name: string, description: string, canvasJson: any, visibility?: 'OFFICIAL' | 'COMMUNITY' | 'PRIVATE' | 'ORGANIZATION', version?: string, changelog?: string): Promise<any>;
    private publishEvent;
}
