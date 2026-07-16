import { Ad } from '@prisma/client';
export interface IMetaAdPublishResult {
    externalAdId: string;
    rawResponse: any;
}
export interface IAdPublisher {
    publish(ad: Ad, externalAdSetId: string, externalCreativeId: string, accessToken: string, adAccountExternalId: string): Promise<IMetaAdPublishResult>;
}
