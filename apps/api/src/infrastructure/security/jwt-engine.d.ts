export declare class JwtEngine {
    private static readonly SECRET;
    static sign(payload: any, expiresInSeconds: number): string;
    static verify(token: string): any;
    private static base64url;
    private static hmac;
}
