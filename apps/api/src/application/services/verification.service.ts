import { Injectable, Inject } from '@nestjs/common';
import { VerificationToken } from '@prisma/client';
import { CreateVerificationTokenDto, VerifyEmailDto, VerificationResponseDto } from '../../common/dto/verification.dto';
import { IVerificationService } from '../../common/ports/identity/verification-service.interface';
import { VerificationRepository } from '../../infrastructure/database/repositories/verification.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
import { TOKEN_GENERATOR, CLOCK_PROVIDER } from '../../infrastructure/security/security.module';
import { 
  AlreadyVerifiedException, 
  InvalidTokenException, 
  ExpiredTokenException, 
  VerificationUserNotFoundException 
} from '../../common/exceptions/verification-exceptions';
import { VerificationMapper } from '../../common/mappers/verification.mapper';

@Injectable()
export class VerificationService implements IVerificationService {
  constructor(
    private readonly verificationRepo: VerificationRepository,
    private readonly userRepo: UserRepository,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async createToken(dto: CreateVerificationTokenDto): Promise<VerificationToken> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user || user.deletedAt) {
      throw new VerificationUserNotFoundException(dto.userId);
    }

    if (user.emailVerifiedAt) {
      throw new AlreadyVerifiedException(user.email);
    }

    const token = this.tokenGenerator.generate(32); // Generate a cryptographically secure token
    const now = this.clockProvider.now();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours expiry

    const verificationToken: VerificationToken = {
      id: '',
      userId: dto.userId,
      tokenHash: token,
      tokenType: dto.tokenType,
      createdAt: now,
      expiresAt,
      usedAt: null,
    };

    return await this.verificationRepo.save(verificationToken);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<VerificationResponseDto> {
    const tokenRecord = await this.verificationRepo.findByTokenHash(dto.token);
    if (!tokenRecord || tokenRecord.usedAt) {
      throw new InvalidTokenException();
    }

    const now = this.clockProvider.now();
    if (tokenRecord.expiresAt < now) {
      throw new ExpiredTokenException();
    }

    const user = await this.userRepo.findById(tokenRecord.userId);
    if (!user || user.deletedAt) {
      throw new VerificationUserNotFoundException(tokenRecord.userId);
    }

    if (user.emailVerifiedAt) {
      // Mark token as used to clean up
      tokenRecord.usedAt = now;
      await this.verificationRepo.save(tokenRecord);
      throw new AlreadyVerifiedException(user.email);
    }

    // Update user status & verification date
    user.emailVerifiedAt = now;
    user.status = 'ACTIVE';
    await this.userRepo.save(user);

    // Mark token as used
    tokenRecord.usedAt = now;
    await this.verificationRepo.save(tokenRecord);

    return VerificationMapper.toResponse(user);
  }

  async resendVerification(userId: string): Promise<VerificationToken> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new VerificationUserNotFoundException(userId);
    }

    if (user.emailVerifiedAt) {
      throw new AlreadyVerifiedException(user.email);
    }

    // Deactivate previous active tokens
    const lastActive = await this.verificationRepo.findLatestActiveToken(userId, 'EMAIL_VERIFICATION');
    if (lastActive) {
      lastActive.usedAt = this.clockProvider.now(); // Invalidate
      await this.verificationRepo.save(lastActive);
    }

    return await this.createToken({
      userId,
      tokenType: 'EMAIL_VERIFICATION',
    });
  }
}
