export declare class CreateSessionDto {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    device?: string;
    browser?: string;
    os?: string;
    country?: string;
    city?: string;
    tokenHash?: string;
    rememberMe?: boolean;
}
export declare class SessionResponseDto {
    id: string;
    userId: string;
    tokenHash: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    device?: string | null;
    browser?: string | null;
    os?: string | null;
    country?: string | null;
    city?: string | null;
    lastActivityAt: string;
    expiresAt: string;
    createdAt: string;
}
