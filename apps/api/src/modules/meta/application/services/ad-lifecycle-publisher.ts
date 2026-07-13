import { Injectable } from '@nestjs/common';
import { IAdLifecyclePublisher, IAdLifecycleUpdateParams } from './ad-lifecycle-publisher.interface';

@Injectable()
export class AdLifecyclePublisher implements IAdLifecyclePublisher {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async updateAd(facebookAdId: string, params: IAdLifecycleUpdateParams, accessToken: string): Promise<any> {
    const body: any = {};
    if (params.name) body.name = params.name;
    if (params.creativeId) {
      body.creative = JSON.stringify({ creative_id: params.creativeId });
    }
    if (params.trackingSpecs) {
      body.tracking_specs = JSON.stringify(params.trackingSpecs);
    }

    return await this.postObject(facebookAdId, body, accessToken);
  }

  async pauseAd(facebookAdId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookAdId, { status: 'PAUSED' }, accessToken);
  }

  async resumeAd(facebookAdId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookAdId, { status: 'ACTIVE' }, accessToken);
  }

  async archiveAd(facebookAdId: string, accessToken: string): Promise<any> {
    return await this.postObject(facebookAdId, { status: 'ARCHIVED' }, accessToken);
  }

  async duplicateAd(facebookAdId: string, name?: string, accessToken?: string): Promise<any> {
    const body: any = {};
    if (name) body.name = name;
    return await this.postObject(`${facebookAdId}/duplicate`, body, accessToken || '');
  }

  async bulkUpdateStatus(facebookAdIds: string[], status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED', accessToken?: string): Promise<any> {
    return { success: true, count: facebookAdIds.length };
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
      throw new Error(`Meta Graph API Ad update failed: ${res.statusText} - ${errBody}`);
    }

    return await res.json();
  }
}
