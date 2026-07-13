import { Injectable } from '@nestjs/common';
import { Campaign } from '@prisma/client';
import { ICampaignPublisher, IMetaCampaignPublishResult } from './campaign-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
import { MetaPublishException } from '../../../../common/exceptions/campaign-publish.exceptions';

@Injectable()
export class CampaignPublisher implements ICampaignPublisher {
  constructor(private readonly graphClient: MetaGraphClient) {}

  async publish(campaign: Campaign, accessToken: string, adAccountExternalId: string): Promise<IMetaCampaignPublishResult> {
    try {
      const cleanAdAccountId = adAccountExternalId.startsWith('act_')
        ? adAccountExternalId
        : `act_${adAccountExternalId}`;

      const payload = {
        name: campaign.name,
        objective: campaign.objective,
        status: 'PAUSED',
        special_ad_categories: `["${campaign.specialAdCategory}"]`,
        buying_type: campaign.buyingType,
      };

      const response = await this.graphClient.post<any>(
        `${cleanAdAccountId}/campaigns`,
        accessToken,
        payload,
      );

      if (!response || !response.id) {
        throw new MetaPublishException('Invalid empty campaign response received from Meta Graph API');
      }

      return {
        externalCampaignId: response.id,
        rawResponse: response,
      };
    } catch (e: any) {
      throw new MetaPublishException(e.message || 'Error occurred during Graph API publish operation', e.response?.data);
    }
  }
}
