import { UserSession } from '@prisma/client';
import { SessionResponseDto } from '../dto/session.dto';

export class SessionMapper {
  static toResponse(session: UserSession): SessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      device: session.device,
      browser: session.browser,
      os: session.os,
      country: session.country,
      city: session.city,
      lastActivityAt: session.lastActivityAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
    };
  }

  static toResponseList(sessions: UserSession[]): SessionResponseDto[] {
    return sessions.map(s => this.toResponse(s));
  }
}
