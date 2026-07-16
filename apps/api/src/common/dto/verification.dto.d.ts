export declare class CreateVerificationTokenDto {
    userId: string;
    tokenType: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class VerificationResponseDto {
    userId: string;
    email: string;
    status: string;
    verifiedAt: string;
}
