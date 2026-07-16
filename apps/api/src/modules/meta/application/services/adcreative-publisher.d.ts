import { AdCreative } from '@prisma/client';
import { IAdCreativePublisher, IMetaAdCreativePublishResult } from './adcreative-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
export declare class AdCreativePublisher implements IAdCreativePublisher {
    private readonly graphClient;
    constructor(graphClient: MetaGraphClient);
    publish(adCreative: AdCreative, pageExternalId: string, instagramExternalId: string | null, accessToken: string, adAccountExternalId: string): Promise<IMetaAdCreativePublishResult>;
}
