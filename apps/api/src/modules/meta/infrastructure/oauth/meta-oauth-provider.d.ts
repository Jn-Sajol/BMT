import { IMetaOAuthProvider } from './meta-oauth-provider.interface';
export declare class MetaOAuthProvider implements IMetaOAuthProvider {
    private readonly clientId;
    private readonly clientSecret;
    private readonly redirectUri;
    getAuthorizationUrl(state: string): string;
    exchangeCode(code: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    exchangeLongLivedToken(shortLivedToken: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    validateToken(token: string): Promise<{
        isValid: boolean;
        facebookUserId: string;
        facebookUserName: string;
        scopes: string[];
    }>;
}
