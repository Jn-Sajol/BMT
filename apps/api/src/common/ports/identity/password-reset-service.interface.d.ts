import { PasswordResetToken } from '@prisma/client';
import { RequestPasswordResetDto, PasswordResetResponseDto, ExecutePasswordResetDto } from '../../dto/password-reset.dto';
export interface IPasswordResetService {
    requestReset(dto: RequestPasswordResetDto): Promise<PasswordResetToken>;
    verifyResetToken(token: string): Promise<PasswordResetResponseDto>;
    executeReset(dto: ExecutePasswordResetDto): Promise<void>;
}
