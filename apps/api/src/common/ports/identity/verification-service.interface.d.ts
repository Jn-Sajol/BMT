import { VerificationToken } from '@prisma/client';
import { CreateVerificationTokenDto, VerifyEmailDto, VerificationResponseDto } from '../../dto/verification.dto';
export interface IVerificationService {
    createToken(dto: CreateVerificationTokenDto): Promise<VerificationToken>;
    verifyEmail(dto: VerifyEmailDto): Promise<VerificationResponseDto>;
    resendVerification(userId: string): Promise<VerificationToken>;
}
