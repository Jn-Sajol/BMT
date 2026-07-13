import { MetaOutboxJob } from '@prisma/client';

export interface IMetaOutboxPublisher {
  publishToOutbox(
    workspaceId: string,
    objectType: string,
    objectId: string,
    action: string,
    payload: any,
    userId: string,
    correlationId?: string,
    causationId?: string,
    idempotencyKey?: string,
    priority?: number,
  ): Promise<MetaOutboxJob>;
}
