import { Campaign } from '@prisma/client';
export interface IMetaCampaignPublishResult {
    externalCampaignId: string;
    rawResponse: any;
}
export interface ICampaignPublisher {
    publish(campaign: Campaign, accessToken: string, adAccountExternalId: string): Promise<IMetaCampaignPublishResult>;
}
