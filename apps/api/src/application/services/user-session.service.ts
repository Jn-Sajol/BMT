import { Injectable, Inject } from '@nestjs/common';
import { UserSession } from '@prisma/client';
import { CreateSessionDto } from '../../common/dto/session.dto';
import { IUserSessionService } from '../../common/ports/user-session-service.interface';
import { UserSessionRepository } from '../../infrastructure/database/repositories/user-session.repository';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
import { TOKEN_GENERATOR, CLOCK_PROVIDER } from '../../infrastructure/security/security.module';

@Injectable()
export class UserSessionService implements IUserSessionService {
  constructor(
    private readonly sessionRepo: UserSessionRepository,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async createSession(dto: CreateSessionDto): Promise<UserSession> {
    const tokenHash = dto.tokenHash || this.tokenGenerator.generate(48); // Generate secure session token
    const now = this.clockProvider.now();
    
    // Remember me: 30 days, Default: 24 hours
    const durationMs = dto.rememberMe 
      ? 30 * 24 * 60 * 60 * 1000 
      : 24 * 60 * 60 * 1000;
    const expiresAt = new Date(now.getTime() + durationMs);

    const session: UserSession = {
      id: '',
      userId: dto.userId,
      tokenHash,
      ipAddress: dto.ipAddress || null,
      userAgent: dto.userAgent || null,
      device: dto.device || null,
      browser: dto.browser || null,
      os: dto.os || null,
      country: dto.country || null,
      city: dto.city || null,
      lastActivityAt: now,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    };

    return await this.sessionRepo.save(session);
  }

  async validateSession(tokenHash: string): Promise<UserSession | null> {
    const session = await this.sessionRepo.findByTokenHash(tokenHash);
    if (!session) return null;

    const now = this.clockProvider.now();
    if (session.expiresAt < now) {
      await this.sessionRepo.delete(session.id);
      return null;
    }

    // Update last activity audit timestamp on validation
    session.lastActivityAt = now;
    session.updatedAt = now;
    return await this.sessionRepo.save(session);
  }

  async revokeSession(id: string): Promise<void> {
    await this.sessionRepo.delete(id);
  }

  async revokeAllSessionsByUserId(userId: string): Promise<void> {
    await this.sessionRepo.deleteAllSessions(userId);
  }

  async getActiveSessions(userId: string): Promise<UserSession[]> {
    return await this.sessionRepo.findActiveSessionsByUserId(userId);
  }
}
