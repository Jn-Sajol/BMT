import { VerificationToken } from '@prisma/client';
import { CreateVerificationTokenDto, VerifyEmailDto, VerificationResponseDto } from '../../common/dto/verification.dto';
import { IVerificationService } from '../../common/ports/identity/verification-service.interface';
import { VerificationRepository } from '../../infrastructure/database/repositories/verification.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
export declare class VerificationService implements IVerificationService {
    private readonly verificationRepo;
    private readonly userRepo;
    private readonly tokenGenerator;
    private readonly clockProvider;
    constructor(verificationRepo: VerificationRepository, userRepo: UserRepository, tokenGenerator: ITokenGenerator, clockProvider: IClockProvider);
    createToken(dto: CreateVerificationTokenDto): Promise<VerificationToken>;
    verifyEmail(dto: VerifyEmailDto): Promise<VerificationResponseDto>;
    resendVerification(userId: string): Promise<VerificationToken>;
}
