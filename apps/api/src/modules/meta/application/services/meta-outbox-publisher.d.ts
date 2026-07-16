import { IMetaOutboxPublisher } from './meta-outbox-publisher.interface';
import { MetaOutboxRepository } from '../../../../infrastructure/database/repositories/meta-outbox.repository';
import { MetaOutboxJob } from '@prisma/client';
export declare class MetaOutboxPublisher implements IMetaOutboxPublisher {
    private readonly outboxRepo;
    constructor(outboxRepo: MetaOutboxRepository);
    publishToOutbox(workspaceId: string, objectType: string, objectId: string, action: string, payload: any, userId: string, correlationId?: string, causationId?: string, idempotencyKey?: string, priority?: number): Promise<MetaOutboxJob>;
}
