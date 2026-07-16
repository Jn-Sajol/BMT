import { ExtendedPrismaClient } from '../prisma-extensions';
import { WebhookInbox } from '@prisma/client';
export declare class WebhookInboxRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findByKey(idempotencyKey: string): Promise<WebhookInbox | null>;
    insertEvent(provider: string, externalId: string, idempotencyKey: string, payload: any): Promise<WebhookInbox>;
    updateStatus(id: string, status: string, errorMessage?: string | null, processedAt?: Date | null): Promise<WebhookInbox>;
}
