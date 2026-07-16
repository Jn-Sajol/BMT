export declare class RequestPasswordResetDto {
    email: string;
}
export declare class PasswordResetResponseDto {
    userId: string;
    email: string;
    status: string;
    tokenHash: string;
    isValid: boolean;
}
export declare class ExecutePasswordResetDto {
    token: string;
    newPassword: string;
}
