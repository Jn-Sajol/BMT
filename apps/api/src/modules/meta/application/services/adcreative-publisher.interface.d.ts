import { AdCreative } from '@prisma/client';
export interface IMetaAdCreativePublishResult {
    externalCreativeId: string;
    rawResponse: any;
}
export interface IAdCreativePublisher {
    publish(adCreative: AdCreative, pageExternalId: string, instagramExternalId: string | null, accessToken: string, adAccountExternalId: string): Promise<IMetaAdCreativePublishResult>;
}
