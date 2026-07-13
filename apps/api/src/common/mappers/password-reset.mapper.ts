import { User, PasswordResetToken } from '@prisma/client';
import { PasswordResetResponseDto } from '../dto/password-reset.dto';

export class PasswordResetMapper {
  static toResponse(user: User, tokenRecord: PasswordResetToken, isValid: boolean): PasswordResetResponseDto {
    return {
      userId: user.id,
      email: user.email,
      status: user.status,
      tokenHash: tokenRecord.tokenHash,
      isValid,
    };
  }
}
