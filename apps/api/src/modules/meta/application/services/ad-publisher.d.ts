import { Ad } from '@prisma/client';
import { IAdPublisher, IMetaAdPublishResult } from './ad-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
export declare class MetaAdPublisher implements IAdPublisher {
    private readonly graphClient;
    constructor(graphClient: MetaGraphClient);
    publish(ad: Ad, externalAdSetId: string, externalCreativeId: string, accessToken: string, adAccountExternalId: string): Promise<IMetaAdPublishResult>;
}
