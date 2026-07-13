import { Injectable } from '@nestjs/common';
import { IMetaGraphStatusClient, IMetaGraphStatusResponse } from './meta-graph-status-client.interface';

@Injectable()
export class MetaGraphStatusClient implements IMetaGraphStatusClient {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';
  private readonly fields = 'id,name,status,configured_status,effective_status,delivery_info,issues_info,review_feedback,updated_time';

  async fetchCampaignStatus(facebookCampaignId: string, accessToken: string): Promise<IMetaGraphStatusResponse> {
    return await this.fetchObject(facebookCampaignId, accessToken);
  }

  async fetchAdSetStatus(facebookAdSetId: string, accessToken: string): Promise<IMetaGraphStatusResponse> {
    return await this.fetchObject(facebookAdSetId, accessToken);
  }

  async fetchAdStatus(facebookAdId: string, accessToken: string): Promise<IMetaGraphStatusResponse> {
    return await this.fetchObject(facebookAdId, accessToken);
  }

  private async fetchObject(objectId: string, accessToken: string): Promise<IMetaGraphStatusResponse> {
    const url = new URL(`${this.baseUrl}/${objectId}`);
    url.searchParams.append('access_token', accessToken);
    url.searchParams.append('fields', this.fields);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta Graph API Status failed: ${res.statusText} - ${errBody}`);
    }
    return await res.json() as IMetaGraphStatusResponse;
  }
}
