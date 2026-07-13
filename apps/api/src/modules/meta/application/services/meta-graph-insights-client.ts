import { Injectable } from '@nestjs/common';
import { IMetaGraphInsightsClient, IMetaGraphInsightsResponse } from './meta-graph-insights-client.interface';

@Injectable()
export class MetaGraphInsightsClient implements IMetaGraphInsightsClient {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async fetchInsights(
    facebookObjectId: string,
    accessToken: string,
    fields: string[],
    params: {
      date_preset?: string;
      time_range?: { since: string; until: string };
      time_increment?: string | number;
      limit?: number;
      after?: string;
    },
  ): Promise<IMetaGraphInsightsResponse> {
    const url = new URL(`${this.baseUrl}/${facebookObjectId}/insights`);
    url.searchParams.append('access_token', accessToken);
    url.searchParams.append('fields', fields.join(','));

    if (params.date_preset) {
      url.searchParams.append('date_preset', params.date_preset);
    }
    if (params.time_range) {
      url.searchParams.append('time_range', JSON.stringify(params.time_range));
    }
    if (params.time_increment) {
      url.searchParams.append('time_increment', String(params.time_increment));
    }
    if (params.limit) {
      url.searchParams.append('limit', String(params.limit));
    }
    if (params.after) {
      url.searchParams.append('after', params.after);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta Graph API Insights failed: ${res.statusText} - ${errBody}`);
    }
    return await res.json() as IMetaGraphInsightsResponse;
  }
}
