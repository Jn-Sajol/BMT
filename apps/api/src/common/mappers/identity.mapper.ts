import { User } from '@prisma/client';
import { UserResponseDto } from '../dto/identity-response.dto';

export class IdentityMapper {
  static toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
