import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaGraphClient {
  private readonly baseUrl = 'https://graph.facebook.com/v18.0';

  async get<T = any>(endpoint: string, accessToken: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint.replace(/^\//, '')}`);
    url.searchParams.append('access_token', accessToken);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta Graph API GET failed: ${res.statusText} - ${errBody}`);
    }
    return await res.json() as T;
  }

  async post<T = any>(endpoint: string, accessToken: string, body: any): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint.replace(/^\//, '')}`);
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
      throw new Error(`Meta Graph API POST failed: ${res.statusText} - ${errBody}`);
    }
    return await res.json() as T;
  }

  async pagination<T = any>(nextUrl: string): Promise<{ data: T[]; paging?: { cursors?: { after?: string; before?: string }; next?: string } }> {
    const res = await fetch(nextUrl);
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Meta Graph API Pagination failed: ${res.statusText} - ${errBody}`);
    }
    return await res.json() as any;
  }
}
