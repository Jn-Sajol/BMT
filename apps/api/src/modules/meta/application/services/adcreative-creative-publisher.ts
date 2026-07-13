import { Injectable } from '@nestjs/common';
import { IAdCreativeLifecyclePublisher } from './adcreative-lifecycle-publisher.interface';

@Injectable()
export class AdCreativeLifecyclePublisher implements IAdCreativeLifecyclePublisher {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async updateAdCreative(facebookCreativeId: string, params: any, accessToken: string): Promise<any> {
    const url = new URL(`${this.baseUrl}/${facebookCreativeId}`);
    url.searchParams.append('access_token', accessToken);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta AdCreative is immutable. Update failed: ${res.statusText} - ${errBody}`);
    }

    return await res.json();
  }

  async recreateAdCreative(params: any, accessToken: string): Promise<any> {
    const url = new URL(`${this.baseUrl}/${params.accountId}/adcreatives`);
    url.searchParams.append('access_token', accessToken);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.spec),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta AdCreative recreation failed: ${res.statusText} - ${errBody}`);
    }

    return await res.json();
  }
}
