import { Injectable } from '@nestjs/common';
import { IMetaOutboxPublisher } from './meta-outbox-publisher.interface';
import { MetaOutboxRepository } from '../../../../infrastructure/database/repositories/meta-outbox.repository';
import { MetaOutboxJob } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class MetaOutboxPublisher implements IMetaOutboxPublisher {
  constructor(private readonly outboxRepo: MetaOutboxRepository) {}

  async publishToOutbox(
    workspaceId: string,
    objectType: string,
    objectId: string,
    action: string,
    payload: any,
    userId: string,
    correlationId?: string,
    causationId?: string,
    idempotencyKey?: string,
    priority: number = 0,
  ): Promise<MetaOutboxJob> {
    const finalCorrelationId = correlationId || crypto.randomUUID();
    const finalCausationId = causationId || crypto.randomUUID();
    const finalIdempotencyKey = idempotencyKey || `${objectType}:${objectId}:${action}:${Date.now()}`;

    return await this.outboxRepo.createJob({
      workspaceId,
      provider: 'meta',
      objectType,
      objectId,
      action,
      payload,
      priority,
      correlationId: finalCorrelationId,
      causationId: finalCausationId,
      idempotencyKey: finalIdempotencyKey,
      maxAttempts: 5,
      nextRunAt: new Date(),
      createdBy: userId,
    });
  }
}
