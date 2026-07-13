import { Injectable } from '@nestjs/common';
import { Ad } from '@prisma/client';
import { IAdPublisher, IMetaAdPublishResult } from './ad-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
import { FacebookAdPublishException } from '../../../../common/exceptions/ad-publish.exceptions';

@Injectable()
export class MetaAdPublisher implements IAdPublisher {
  constructor(private readonly graphClient: MetaGraphClient) {}

  async publish(
    ad: Ad,
    externalAdSetId: string,
    externalCreativeId: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaAdPublishResult> {
    try {
      const cleanAdAccountId = adAccountExternalId.startsWith('act_')
        ? adAccountExternalId
        : `act_${adAccountExternalId}`;

      const payload: Record<string, any> = {
        name: ad.name,
        adset_id: externalAdSetId,
        creative: {
          creative_id: externalCreativeId,
        },
        status: 'PAUSED',
      };

      if (ad.trackingSpecs && Object.keys(ad.trackingSpecs as any).length > 0) {
        payload.tracking_specs = JSON.stringify(ad.trackingSpecs);
      }

      const response = await this.graphClient.post<any>(
        `${cleanAdAccountId}/ads`,
        accessToken,
        payload,
      );

      if (!response || !response.id) {
        throw new FacebookAdPublishException('Invalid empty Ad response received from Meta Graph API');
      }

      return {
        externalAdId: response.id,
        rawResponse: response,
      };
    } catch (e: any) {
      throw new FacebookAdPublishException(e.message || 'Error occurred during Graph API publish operation', e.response?.data);
    }
  }
}
