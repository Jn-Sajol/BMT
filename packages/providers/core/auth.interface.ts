export interface OAuthExchangeResult {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  scope?: string
}

export interface IProviderAuth {
  getAuthUrl: (clientId: string, redirectUri: string, scopes: string[]) => string
  exchangeCode: (clientId: string, clientSecret: string, code: string, redirectUri: string) => Promise<OAuthExchangeResult>
  refreshToken?: (clientId: string, clientSecret: string, refreshToken: string) => Promise<OAuthExchangeResult>
  validateToken: (accessToken: string) => Promise<boolean>
}
