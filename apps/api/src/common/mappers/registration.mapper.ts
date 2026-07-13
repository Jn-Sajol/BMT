import { User } from '@prisma/client';
import { RegistrationResponseDto } from '../dto/registration.dto';

export class RegistrationMapper {
  static toResponse(user: User): RegistrationResponseDto {
    return {
      userId: user.id,
      email: user.email,
      status: user.status,
    };
  }
}
