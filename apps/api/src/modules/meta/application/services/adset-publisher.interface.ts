import { AdSet } from '@prisma/client';

export interface IMetaAdSetPublishResult {
  externalAdSetId: string;
  rawResponse: any;
}

export interface IAdSetPublisher {
  publish(
    adSet: AdSet,
    externalCampaignId: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaAdSetPublishResult>;
}
