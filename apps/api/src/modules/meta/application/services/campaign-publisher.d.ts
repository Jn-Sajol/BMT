import { Campaign } from '@prisma/client';
import { ICampaignPublisher, IMetaCampaignPublishResult } from './campaign-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
export declare class CampaignPublisher implements ICampaignPublisher {
    private readonly graphClient;
    constructor(graphClient: MetaGraphClient);
    publish(campaign: Campaign, accessToken: string, adAccountExternalId: string): Promise<IMetaCampaignPublishResult>;
}
