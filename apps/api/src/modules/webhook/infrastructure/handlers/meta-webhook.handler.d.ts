import { IWebhookHandler } from '../../application/ports/webhook-handler.interface';
import { AdLifecycleRepository } from '../../../../infrastructure/database/repositories/ad-lifecycle.repository';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
export declare class MetaWebhookHandler implements IWebhookHandler {
    private readonly adRepo;
    private readonly clockProvider;
    constructor(adRepo: AdLifecycleRepository, clockProvider: IClockProvider);
    supports(provider: string, eventType: string): boolean;
    handle(payload: any): Promise<void>;
}
