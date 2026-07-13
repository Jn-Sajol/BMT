import { Injectable, Inject } from '@nestjs/common';
import { PasswordResetToken } from '@prisma/client';
import { RequestPasswordResetDto, PasswordResetResponseDto, ExecutePasswordResetDto } from '../../common/dto/password-reset.dto';
import { IPasswordResetService } from '../../common/ports/identity/password-reset-service.interface';
import { PasswordResetRepository } from '../../infrastructure/database/repositories/password-reset.repository';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';
import { IPasswordHistoryValidator } from '../../common/ports/identity/password-history-validator.interface';
import { UserSessionService } from './user-session.service';
import { TOKEN_GENERATOR, CLOCK_PROVIDER, PASSWORD_HASHER } from '../../infrastructure/security/security.module';
import { 
  ResetTokenExpiredException, 
  ResetTokenInvalidException, 
  PasswordResetUserNotFoundException 
} from '../../common/exceptions/password-reset-exceptions';
import { PasswordResetMapper } from '../../common/mappers/password-reset.mapper';

export const PASSWORD_HISTORY_VALIDATOR = 'PASSWORD_HISTORY_VALIDATOR';

@Injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    private readonly resetRepo: PasswordResetRepository,
    private readonly userRepo: UserRepository,
    private readonly userSessionService: UserSessionService,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(PASSWORD_HISTORY_VALIDATOR)
    private readonly historyValidator: IPasswordHistoryValidator,
  ) {}

  async requestReset(dto: RequestPasswordResetDto): Promise<PasswordResetToken> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || user.deletedAt) {
      throw new PasswordResetUserNotFoundException(dto.email);
    }

    const now = this.clockProvider.now();

    // 1. Invalidate previous active password reset tokens
    const lastActive = await this.resetRepo.findLatestActiveToken(user.id);
    if (lastActive) {
      lastActive.usedAt = now;
      await this.resetRepo.save(lastActive);
    }

    // 2. Generate a secure reset token (hex)
    const token = this.tokenGenerator.generate(32);
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours expiry

    const resetToken: PasswordResetToken = {
      id: '',
      userId: user.id,
      tokenHash: token,
      createdAt: now,
      expiresAt,
      usedAt: null,
    };

    return await this.resetRepo.save(resetToken);
  }

  async verifyResetToken(token: string): Promise<PasswordResetResponseDto> {
    const tokenRecord = await this.resetRepo.findByTokenHash(token);
    if (!tokenRecord || tokenRecord.usedAt) {
      throw new ResetTokenInvalidException();
    }

    const now = this.clockProvider.now();
    if (tokenRecord.expiresAt < now) {
      throw new ResetTokenExpiredException();
    }

    const user = await this.userRepo.findById(tokenRecord.userId);
    if (!user || user.deletedAt) {
      throw new PasswordResetUserNotFoundException(tokenRecord.userId);
    }

    return PasswordResetMapper.toResponse(user, tokenRecord, true);
  }

  async executeReset(dto: ExecutePasswordResetDto): Promise<void> {
    const tokenRecord = await this.resetRepo.findByTokenHash(dto.token);
    if (!tokenRecord || tokenRecord.usedAt) {
      throw new ResetTokenInvalidException();
    }

    const now = this.clockProvider.now();
    if (tokenRecord.expiresAt < now) {
      throw new ResetTokenExpiredException();
    }

    const user = await this.userRepo.findById(tokenRecord.userId);
    if (!user || user.deletedAt) {
      throw new PasswordResetUserNotFoundException(tokenRecord.userId);
    }

    // 1. Validate password history (prevent password reuse check)
    await this.historyValidator.validate(user.id, dto.newPassword);

    // 2. Hash new password
    const hashedPassword = await this.passwordHasher.hash(dto.newPassword);

    // 3. Update user password hash
    user.passwordHash = hashedPassword;
    user.updatedAt = now;
    await this.userRepo.save(user);

    // 4. Invalidate the reset token
    tokenRecord.usedAt = now;
    await this.resetRepo.save(tokenRecord);

    // 5. Invalidate existing sessions
    await this.userSessionService.revokeAllSessionsByUserId(user.id);
  }
}
