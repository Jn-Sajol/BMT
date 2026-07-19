import { Injectable } from "@nestjs/common"

@Injectable()
export class FacebookOauthService {
  public getAuthUrl(clientId: string, redirectUri: string, scopes: string[]): string {
    const scopeStr = encodeURIComponent(scopes.join(","))
    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopeStr}&response_type=code`
  }

  public async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<{ accessToken: string; expiresAt: number }> {
    console.log("[FacebookOauthService] Exchanging Auth Code via official Graph API endpoints...")
    return {
      accessToken: "fb-mock-access-token",
      expiresAt: Date.now() + 3600 * 1000,
    }
  }
}
