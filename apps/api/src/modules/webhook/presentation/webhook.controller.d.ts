import { WebhookDispatcher } from '../application/services/webhook-dispatcher.service';
export declare class WebhookController {
    private readonly dispatcher;
    constructor(dispatcher: WebhookDispatcher);
    verify(mode: string, token: string, challenge: string): string;
    handle(provider: string, signature: string, req: any, body: any): Promise<{
        success: boolean;
    }>;
}
