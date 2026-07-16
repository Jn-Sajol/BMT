import { User, PasswordResetToken } from '@prisma/client';
import { PasswordResetResponseDto } from '../dto/password-reset.dto';
export declare class PasswordResetMapper {
    static toResponse(user: User, tokenRecord: PasswordResetToken, isValid: boolean): PasswordResetResponseDto;
}
