import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class TemplateReviewService {
    private readonly prisma;
    private readonly eventBus;
    constructor(prisma: ExtendedPrismaClient, eventBus: IEventBus);
    createReview(workspaceId: string, templateId: string, rating: number, comment: string): Promise<any>;
    deleteReview(workspaceId: string, id: string): Promise<void>;
    private publishEvent;
}
