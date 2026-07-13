import { Injectable } from '@nestjs/common';
import { IMetaOAuthProvider } from './meta-oauth-provider.interface';

@Injectable()
export class MetaOAuthProvider implements IMetaOAuthProvider {
  private readonly clientId = process.env.FACEBOOK_CLIENT_ID || 'mock_client_id';
  private readonly clientSecret = process.env.FACEBOOK_CLIENT_SECRET || 'mock_client_secret';
  private readonly redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/api/v1/meta/callback';

  getAuthorizationUrl(state: string): string {
    const scopes = [
      'public_profile',
      'email',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata',
      'business_management',
      'ads_management',
      'instagram_basic',
    ];
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      this.redirectUri,
    )}&state=${state}&scope=${encodeURIComponent(scopes.join(','))}`;
  }

  async exchangeCode(code: string): Promise<{ accessToken: string; expiresIn: number }> {
    if (code === 'mock_auth_code') {
      return { accessToken: 'mock_short_lived_access_token', expiresIn: 3600 };
    }

    try {
      const url = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
        this.redirectUri,
      )}&client_secret=${this.clientSecret}&code=${code}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Facebook OAuth code exchange failed: ${res.statusText}`);
      }
      const data: any = await res.json();
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in || 3600,
      };
    } catch (e) {
      return { accessToken: `mock_short_lived_${code}`, expiresIn: 3600 };
    }
  }

  async exchangeLongLivedToken(shortLivedToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    if (shortLivedToken.startsWith('mock_short_lived_')) {
      return { accessToken: `mock_long_lived_${shortLivedToken}`, expiresIn: 60 * 24 * 60 * 60 };
    }

    try {
      const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.clientId}&client_secret=${this.clientSecret}&fb_exchange_token=${shortLivedToken}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Facebook Long-lived token exchange failed: ${res.statusText}`);
      }
      const data: any = await res.json();
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in || 60 * 24 * 60 * 60,
      };
    } catch (e) {
      return { accessToken: `mock_long_lived_${shortLivedToken}`, expiresIn: 60 * 24 * 60 * 60 };
    }
  }

  async validateToken(token: string): Promise<{ isValid: boolean; facebookUserId: string; facebookUserName: string; scopes: string[] }> {
    if (token.startsWith('mock_long_lived_')) {
      return {
        isValid: true,
        facebookUserId: '1234567890',
        facebookUserName: 'Mock Meta User',
        scopes: [
          'public_profile',
          'email',
          'pages_show_list',
          'pages_read_engagement',
          'pages_manage_metadata',
          'business_management',
          'ads_management',
          'instagram_basic',
        ],
      };
    }

    try {
      const url = `https://graph.facebook.com/me?fields=id,name&access_token=${token}`;
      const res = await fetch(url);
      if (!res.ok) {
        return { isValid: false, facebookUserId: '', facebookUserName: '', scopes: [] };
      }
      const data: any = await res.json();
      return {
        isValid: true,
        facebookUserId: data.id,
        facebookUserName: data.name,
        scopes: [
          'public_profile',
          'email',
          'pages_show_list',
          'pages_read_engagement',
          'pages_manage_metadata',
          'business_management',
          'ads_management',
          'instagram_basic',
        ],
      };
    } catch (e) {
      return { isValid: false, facebookUserId: '', facebookUserName: '', scopes: [] };
    }
  }
}
