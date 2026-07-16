import { User } from '@prisma/client';
import { VerificationResponseDto } from '../dto/verification.dto';
export declare class VerificationMapper {
    static toResponse(user: User): VerificationResponseDto;
}
