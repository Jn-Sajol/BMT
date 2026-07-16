export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    name?: string;
    password: string;
}
export declare class TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
