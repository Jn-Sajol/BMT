import { AdSet } from '@prisma/client';
import { IAdSetPublisher, IMetaAdSetPublishResult } from './adset-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
export declare class AdSetPublisher implements IAdSetPublisher {
    private readonly graphClient;
    constructor(graphClient: MetaGraphClient);
    publish(adSet: AdSet, externalCampaignId: string, accessToken: string, adAccountExternalId: string): Promise<IMetaAdSetPublishResult>;
}
