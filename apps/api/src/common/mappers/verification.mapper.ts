import { User } from '@prisma/client';
import { VerificationResponseDto } from '../dto/verification.dto';

export class VerificationMapper {
  static toResponse(user: User): VerificationResponseDto {
    return {
      userId: user.id,
      email: user.email,
      status: user.status,
      verifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : '',
    };
  }
}
