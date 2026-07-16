export declare class ConnectResponseDto {
    authorizationUrl: string;
    state: string;
}
export declare class CallbackResponseDto {
    success: boolean;
    facebookUserId: string;
    facebookUserName: string;
    expiresAt: string;
}
export declare class ConnectionStatusDto {
    isConnected: boolean;
    facebookUserId?: string;
    facebookUserName?: string;
    expiresAt?: string;
    grantedScopes?: string[];
    lastValidatedAt?: string;
    status?: string;
}
export declare class DisconnectResponseDto {
    success: boolean;
    message: string;
}
