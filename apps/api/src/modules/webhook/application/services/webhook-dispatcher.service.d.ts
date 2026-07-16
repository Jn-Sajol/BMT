import { WebhookInboxRepository } from '../../../../infrastructure/database/repositories/webhook-inbox.repository';
import { IWebhookHandler } from '../ports/webhook-handler.interface';
export declare class WebhookDispatcher {
    private readonly inboxRepo;
    private readonly handlers;
    constructor(inboxRepo: WebhookInboxRepository, handlers?: IWebhookHandler[]);
    dispatch(provider: string, externalId: string, payload: any): Promise<void>;
    private processEventAsync;
    private extractEventType;
}
