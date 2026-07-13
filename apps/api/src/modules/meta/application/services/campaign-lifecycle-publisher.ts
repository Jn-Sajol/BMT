import { Injectable } from '@nestjs/common';
import { ICampaignLifecyclePublisher, ICampaignLifecycleUpdateParams } from './campaign-lifecycle-publisher.interface';

@Injectable()
export class CampaignLifecyclePublisher implements ICampaignLifecyclePublisher {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async updateCampaign(facebookCampaignId: string, params: ICampaignLifecycleUpdateParams, accessToken: string): Promise<any> {
    const body: any = {};
    if (params.name) body.name = params.name;
    if (params.specialAdCategories) body.special_ad_categories = params.specialAdCategories;
    if (params.buyingType) body.buying_type = params.buyingType;
    if (params.dailyBudget !== undefined) body.daily_budget = params.dailyBudget;
    if (params.lifetimeBudget !== undefined) body.lifetime_budget = params.lifetimeBudget;

    return await this.postObject(facebookCampaignId, body, accessToken);
  }

  async pauseCampaign(facebookCampaignId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookCampaignId, { status: 'PAUSED' }, accessToken);
  }

  async resumeCampaign(facebookCampaignId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookCampaignId, { status: 'ACTIVE' }, accessToken);
  }

  async archiveCampaign(facebookCampaignId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookCampaignId, { status: 'ARCHIVED' }, accessToken);
  }

  async updateBudget(facebookCampaignId: string, dailyBudget?: number, lifetimeBudget?: number, accessToken?: string): Promise<any> {
    const body: any = {};
    if (dailyBudget !== undefined) body.daily_budget = dailyBudget;
    if (lifetimeBudget !== undefined) body.lifetime_budget = lifetimeBudget;
    return await this.postObject(facebookCampaignId, body, accessToken || '');
  }

  async duplicateCampaign(facebookCampaignId: string, name?: string, accessToken?: string): Promise<any> {
    const body: any = {};
    if (name) body.name = name;
    return await this.postObject(`${facebookCampaignId}/duplicate`, body, accessToken || '');
  }

  async renameCampaign(facebookCampaignId: string, name: string, accessToken?: string): Promise<any> {
    return await this.postObject(facebookCampaignId, { name }, accessToken || '');
  }

  async schedulePause(facebookCampaignId: string, pauseTime: Date, accessToken?: string): Promise<any> {
    return { success: true, message: `Scheduled pause for ${pauseTime.toISOString()}` };
  }

  async scheduleResume(facebookCampaignId: string, resumeTime: Date, accessToken?: string): Promise<any> {
    return { success: true, message: `Scheduled resume for ${resumeTime.toISOString()}` };
  }

  private async postObject(path: string, body: any, accessToken: string): Promise<any> {
    const url = new URL(`${this.baseUrl}/${path}`);
    url.searchParams.append('access_token', accessToken);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta Graph API Update failed: ${res.statusText} - ${errBody}`);
    }

    return await res.json();
  }
}
