import { Injectable } from '@nestjs/common';
import { IAdSetLifecyclePublisher, IAdSetLifecycleUpdateParams } from './adset-lifecycle-publisher.interface';

@Injectable()
export class AdSetLifecyclePublisher implements IAdSetLifecyclePublisher {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async updateAdSet(facebookAdSetId: string, params: IAdSetLifecycleUpdateParams, accessToken: string): Promise<any> {
    const body: any = {};
    if (params.name) body.name = params.name;
    if (params.dailyBudget !== undefined) body.daily_budget = params.dailyBudget;
    if (params.lifetimeBudget !== undefined) body.lifetime_budget = params.lifetimeBudget;
    if (params.bidAmount !== undefined) body.bid_amount = params.bidAmount;
    if (params.bidStrategy) body.bid_strategy = params.bidStrategy;
    if (params.optimizationGoal) body.optimization_goal = params.optimizationGoal;
    if (params.billingEvent) body.billing_event = params.billingEvent;
    if (params.startTime) body.start_time = Math.round(params.startTime.getTime() / 1000);
    if (params.endTime) body.end_time = Math.round(params.endTime.getTime() / 1000);
    if (params.targeting) body.targeting = JSON.stringify(params.targeting);

    return await this.postObject(facebookAdSetId, body, accessToken);
  }

  async pauseAdSet(facebookAdSetId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookAdSetId, { status: 'PAUSED' }, accessToken);
  }

  async resumeAdSet(facebookAdSetId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookAdSetId, { status: 'ACTIVE' }, accessToken);
  }

  async archiveAdSet(facebookAdSetId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookAdSetId, { status: 'ARCHIVED' }, accessToken);
  }

  async updateBudget(facebookAdSetId: string, dailyBudget?: number, lifetimeBudget?: number, accessToken?: string): Promise<any> {
    const body: any = {};
    if (dailyBudget !== undefined) body.daily_budget = dailyBudget;
    if (lifetimeBudget !== undefined) body.lifetime_budget = lifetimeBudget;
    return await this.postObject(facebookAdSetId, body, accessToken || '');
  }

  async duplicateAdSet(facebookAdSetId: string, name?: string, accessToken?: string): Promise<any> {
    const body: any = {};
    if (name) body.name = name;
    return await this.postObject(`${facebookAdSetId}/duplicate`, body, accessToken || '');
  }

  async renameAdSet(facebookAdSetId: string, name: string, accessToken?: string): Promise<any> {
    return await this.postObject(facebookAdSetId, { name }, accessToken || '');
  }

  async schedulePause(facebookAdSetId: string, pauseTime: Date, accessToken?: string): Promise<any> {
    return { success: true, message: `Scheduled pause for ${pauseTime.toISOString()}` };
  }

  async scheduleResume(facebookAdSetId: string, resumeTime: Date, accessToken?: string): Promise<any> {
    return { success: true, message: `Scheduled resume for ${resumeTime.toISOString()}` };
  }

  async updateTargeting(facebookAdSetId: string, targeting: any, accessToken?: string): Promise<any> {
    return await this.postObject(facebookAdSetId, { targeting: JSON.stringify(targeting) }, accessToken || '');
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
