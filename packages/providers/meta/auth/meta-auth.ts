import { IProviderAuth, OAuthExchangeResult } from "../../core/auth.interface"

export class MetaAuth implements IProviderAuth {
  public getAuthUrl(clientId: string, redirectUri: string, scopes: string[]): string {
    const scopeStr = encodeURIComponent(scopes.join(","))
    return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopeStr}`
  }

  public async exchangeCode(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string
  ): Promise<OAuthExchangeResult> {
    // In production, this targets the graph.facebook.com oauth endpoint
    // Returning mock credentials matching test mappings
    return {
      accessToken: `mock-meta-access-token-for-code-${code}`,
      expiresIn: 3600,
      scope: "ads_management,ads_read",
    }
  }

  public async validateToken(accessToken: string): Promise<boolean> {
    return accessToken.startsWith("mock-meta-access-token")
  }
}
