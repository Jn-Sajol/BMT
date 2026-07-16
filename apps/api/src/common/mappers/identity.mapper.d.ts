import { User } from '@prisma/client';
import { UserResponseDto } from '../dto/identity-response.dto';
export declare class IdentityMapper {
    static toUserResponse(user: User): UserResponseDto;
}
