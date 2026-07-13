import { Injectable } from '@nestjs/common';
import { AdSet } from '@prisma/client';
import { IAdSetPublisher, IMetaAdSetPublishResult } from './adset-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
import { AdSetPublishException } from '../../../../common/exceptions/adset-publish.exceptions';

@Injectable()
export class AdSetPublisher implements IAdSetPublisher {
  constructor(private readonly graphClient: MetaGraphClient) {}

  async publish(
    adSet: AdSet,
    externalCampaignId: string,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaAdSetPublishResult> {
    try {
      const cleanAdAccountId = adAccountExternalId.startsWith('act_')
        ? adAccountExternalId
        : `act_${adAccountExternalId}`;

      const payload: Record<string, any> = {
        campaign_id: externalCampaignId,
        name: adSet.name,
        optimization_goal: adSet.optimizationGoal,
        billing_event: adSet.billingEvent,
        status: 'PAUSED',
        targeting: JSON.stringify(adSet.targeting),
        start_time: adSet.startTime.toISOString(),
      };

      if (adSet.bidStrategy) {
        payload.bid_strategy = adSet.bidStrategy;
      }

      if (adSet.dailyBudget) {
        payload.daily_budget = adSet.dailyBudget * 100;
      } else if (adSet.lifetimeBudget) {
        payload.lifetime_budget = adSet.lifetimeBudget * 100;
      }

      if (adSet.endTime) {
        payload.end_time = adSet.endTime.toISOString();
      }

      if (adSet.promotedObject) {
        payload.promoted_object = JSON.stringify(adSet.promotedObject);
      }

      if (adSet.attributionSetting) {
        payload.attribution_spec = JSON.stringify({
          attribution_window: adSet.attributionSetting,
        });
      }

      const response = await this.graphClient.post<any>(
        `${cleanAdAccountId}/adsets`,
        accessToken,
        payload,
      );

      if (!response || !response.id) {
        throw new AdSetPublishException('Invalid empty Ad Set response received from Meta Graph API');
      }

      return {
        externalAdSetId: response.id,
        rawResponse: response,
      };
    } catch (e: any) {
      throw new AdSetPublishException(e.message || 'Error occurred during Graph API publish operation', e.response?.data);
    }
  }
}
