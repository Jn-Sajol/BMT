import { Injectable, Inject } from '@nestjs/common';
import { UserSession } from '@prisma/client';
import { IUserSessionRepository } from '../../../common/ports/user-session-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class UserSessionRepository implements IUserSessionRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<UserSession | null> {
    try {
      return await this.prisma.userSession.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<UserSession | null> {
    try {
      return await this.prisma.userSession.findUnique({ where: { tokenHash } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findActiveSessionsByUserId(userId: string): Promise<UserSession[]> {
    try {
      return await this.prisma.userSession.findMany({
        where: {
          userId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<UserSession[]> {
    try {
      return await this.prisma.userSession.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: UserSession): Promise<UserSession> {
    try {
      return await this.prisma.userSession.upsert({
        where: { id: entity.id || '' },
        update: {
          tokenHash: entity.tokenHash,
          ipAddress: entity.ipAddress,
          userAgent: entity.userAgent,
          device: entity.device,
          browser: entity.browser,
          os: entity.os,
          country: entity.country,
          city: entity.city,
          lastActivityAt: entity.lastActivityAt,
          expiresAt: entity.expiresAt,
        },
        create: {
          userId: entity.userId,
          tokenHash: entity.tokenHash,
          ipAddress: entity.ipAddress,
          userAgent: entity.userAgent,
          device: entity.device,
          browser: entity.browser,
          os: entity.os,
          country: entity.country,
          city: entity.city,
          lastActivityAt: entity.lastActivityAt,
          expiresAt: entity.expiresAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.userSession.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async deleteExpiredSessions(userId: string): Promise<void> {
    try {
      await this.prisma.userSession.deleteMany({
        where: {
          userId,
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async deleteAllSessions(userId: string): Promise<void> {
    try {
      await this.prisma.userSession.deleteMany({
        where: { userId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
