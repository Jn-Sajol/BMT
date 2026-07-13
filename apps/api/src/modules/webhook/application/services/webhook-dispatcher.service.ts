import { Injectable, Inject, Optional } from '@nestjs/common';
import { WebhookInboxRepository } from '../../../../infrastructure/database/repositories/webhook-inbox.repository';
import { IWebhookHandler } from '../ports/webhook-handler.interface';

@Injectable()
export class WebhookDispatcher {
  constructor(
    private readonly inboxRepo: WebhookInboxRepository,
    @Optional()
    @Inject('WEBHOOK_HANDLERS')
    private readonly handlers: IWebhookHandler[] = [],
  ) {}

  async dispatch(provider: string, externalId: string, payload: any): Promise<void> {
    const idempotencyKey = `${provider}:${externalId}`;

    const duplicate = await this.inboxRepo.findByKey(idempotencyKey);
    if (duplicate) {
      return;
    }

    const inboxEntry = await this.inboxRepo.insertEvent(
      provider,
      externalId,
      idempotencyKey,
      payload,
    );

    this.processEventAsync(inboxEntry.id, provider, payload);
  }

  private async processEventAsync(jobId: string, provider: string, payload: any): Promise<void> {
    try {
      await this.inboxRepo.updateStatus(jobId, 'PROCESSING');

      const eventType = this.extractEventType(provider, payload);

      const targetHandlers = this.handlers.filter((h) => h.supports(provider, eventType));
      
      for (const handler of targetHandlers) {
        await handler.handle(payload);
      }

      await this.inboxRepo.updateStatus(jobId, 'COMPLETED', null, new Date());
    } catch (err: any) {
      await this.inboxRepo.updateStatus(jobId, 'FAILED', err.message);
    }
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
