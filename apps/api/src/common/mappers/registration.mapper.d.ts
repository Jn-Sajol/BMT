import { User } from '@prisma/client';
import { RegistrationResponseDto } from '../dto/registration.dto';
export declare class RegistrationMapper {
    static toResponse(user: User): RegistrationResponseDto;
}
