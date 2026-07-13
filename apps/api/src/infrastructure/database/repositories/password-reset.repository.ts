import { Injectable, Inject } from '@nestjs/common';
import { PasswordResetToken } from '@prisma/client';
import { IPasswordResetRepository } from '../../../common/ports/identity/password-reset-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<PasswordResetToken | null> {
    try {
      return await this.prisma.passwordResetToken.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    try {
      return await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findLatestActiveToken(userId: string): Promise<PasswordResetToken | null> {
    try {
      return await this.prisma.passwordResetToken.findFirst({
        where: {
          userId,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<PasswordResetToken[]> {
    try {
      return await this.prisma.passwordResetToken.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: PasswordResetToken): Promise<PasswordResetToken> {
    try {
      return await this.prisma.passwordResetToken.upsert({
        where: { id: entity.id || '' },
        update: {
          tokenHash: entity.tokenHash,
          expiresAt: entity.expiresAt,
          usedAt: entity.usedAt,
        },
        create: {
          userId: entity.userId,
          tokenHash: entity.tokenHash,
          expiresAt: entity.expiresAt,
          usedAt: entity.usedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.passwordResetToken.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
