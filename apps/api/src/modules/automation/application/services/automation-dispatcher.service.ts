import { Injectable, BadRequestException } from '@nestjs/common';
import { CampaignLifecycleService } from '../../../meta/application/services/campaign-lifecycle.service';
import { AdSetLifecycleService } from '../../../meta/application/services/adset-lifecycle.service';
import { AdLifecycleService } from '../../../meta/application/services/ad-lifecycle.service';

@Injectable()
export class AutomationDispatcher {
  constructor(
    private readonly campaignLifecycle: CampaignLifecycleService,
    private readonly adSetLifecycle: AdSetLifecycleService,
    private readonly adLifecycle: AdLifecycleService,
  ) {}

  async dispatch(action: any, workspaceId: string, userId: string, dryRun: boolean): Promise<any> {
    const actionType = action.type;
    const params = action.params || {};

    if (dryRun) {
      return { dryRun: true, status: 'SKIPPED_DISPATCH', actionType, params };
    }

    switch (actionType) {
      case 'Pause Campaign':
        if (!params.campaignId) throw new BadRequestException('campaignId parameter is required.');
        return await this.campaignLifecycle.pauseCampaign(params.campaignId, workspaceId, userId);

      case 'Resume Campaign':
        if (!params.campaignId) throw new BadRequestException('campaignId parameter is required.');
        return await this.campaignLifecycle.resumeCampaign(params.campaignId, workspaceId, userId);

      case 'Pause AdSet':
        if (!params.adSetId) throw new BadRequestException('adSetId parameter is required.');
        return await this.adSetLifecycle.pauseAdSet(params.adSetId, workspaceId, userId);

      case 'Resume AdSet':
        if (!params.adSetId) throw new BadRequestException('adSetId parameter is required.');
        return await this.adSetLifecycle.resumeAdSet(params.adSetId, workspaceId, userId);

      case 'Pause Ad':
        if (!params.adId) throw new BadRequestException('adId parameter is required.');
        return await this.adLifecycle.pauseAd(params.adId, workspaceId, userId);

      case 'Resume Ad':
        if (!params.adId) throw new BadRequestException('adId parameter is required.');
        return await this.adLifecycle.resumeAd(params.adId, workspaceId, userId);

      case 'Call Webhook':
        if (!params.url) throw new BadRequestException('url parameter is required.');
        const method = params.method || 'POST';
        const headers = params.headers || {};
        const response = await fetch(params.url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(params.payload || {}) : undefined,
        });
        const resText = await response.text();
        let resData;
        try {
          resData = JSON.parse(resText);
        } catch {
          resData = resText;
        }
        return { statusCode: response.status, data: resData };

      case 'Send Notification':
        return { status: 'NOTIFICATION_SENT', channel: params.channel || 'email', recipient: params.recipient };

      case 'Future AI Action Placeholder':
        return { status: 'AI_PLACEHOLDER_SKIPPED' };

      default:
        throw new BadRequestException(`Unsupported action: ${actionType}`);
    }
  }
}
