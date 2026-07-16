import { Request } from 'express';
import { PasswordResetService } from '../../application/services/password-reset.service';
import { VerificationService } from '../../application/services/verification.service';
import { LoginDto, RegisterDto, TokenResponseDto, ResetPasswordDto } from '../../common/dto/auth.dto';
import { RequestPasswordResetDto } from '../../common/dto/password-reset.dto';
import { VerifyEmailDto } from '../../common/dto/verification.dto';
import { IAuthService } from '../../common/ports/auth/auth-service.interface';
export declare class AuthController {
    private readonly authService;
    private readonly resetService;
    private readonly verificationService;
    constructor(authService: IAuthService, resetService: PasswordResetService, verificationService: VerificationService);
    register(dto: RegisterDto): Promise<void>;
    login(dto: LoginDto, req: Request): Promise<TokenResponseDto>;
    logout(req: Request): Promise<void>;
    refresh(refreshToken: string, req: Request): Promise<TokenResponseDto>;
    forgotPassword(dto: RequestPasswordResetDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    verifyEmail(dto: VerifyEmailDto): Promise<void>;
    me(req: Request): Promise<any>;
}
