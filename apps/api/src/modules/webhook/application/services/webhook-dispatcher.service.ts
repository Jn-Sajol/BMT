import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { WebhookInboxRepository } from '../../../../infrastructure/database/repositories/webhook-inbox.repository';

@Injectable()
export class WebhookDispatcher {
  private queue: Queue;

  constructor(
    private readonly inboxRepo: WebhookInboxRepository,
  ) {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    const connection = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null, // Required by BullMQ
    });

    this.queue = new Queue('webhook-events', { connection });
  }

  async dispatch(provider: string, externalId: string, payload: any): Promise<void> {
    const idempotencyKey = `${provider}:${externalId}`;

    // 1. Persistent Idempotency Check
    const duplicate = await this.inboxRepo.findByKey(idempotencyKey);
    if (duplicate) {
      console.log(`[WebhookDispatcher] Ignoring duplicate event: ${idempotencyKey}`);
      return;
    }

    // 2. Audit Log Persistence
    const inboxEntry = await this.inboxRepo.insertEvent(
      provider,
      externalId,
      idempotencyKey,
      payload,
    );

    // 3. Payload Normalization
    const eventType = this.extractEventType(provider, payload);
    const normalizedEvent = {
      provider,
      workspaceId: payload.workspaceId || 'default-workspace',
      eventType,
      objectType: payload.objectType || 'campaign',
      objectId: externalId,
      eventTimestamp: new Date().toISOString(),
      rawPayload: payload,
      receivedTimestamp: new Date().toISOString(),
    };

    // 4. Asynchronous Queue Dispatch via BullMQ
    await this.queue.add('event-ingested', {
      inboxId: inboxEntry.id,
      event: normalizedEvent,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });

    console.log(`[WebhookDispatcher] Enqueued event job for: ${idempotencyKey}`);
  }

  private extractEventType(provider: string, payload: any): string {
    if (provider === 'meta') {
      const entry = payload.entry?.[0];
      const change = entry?.changes?.[0];
      return change?.field || 'unknown';
    }
    return payload.eventType || 'generic';
  }
}
