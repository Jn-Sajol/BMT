import { Injectable, Inject } from '@nestjs/common';
import { VerificationToken } from '@prisma/client';
import { IVerificationRepository } from '../../../common/ports/identity/verification-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class VerificationRepository implements IVerificationRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<VerificationToken | null> {
    try {
      return await this.prisma.verificationToken.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<VerificationToken | null> {
    try {
      return await this.prisma.verificationToken.findUnique({ where: { tokenHash } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findLatestActiveToken(userId: string, tokenType: string): Promise<VerificationToken | null> {
    try {
      return await this.prisma.verificationToken.findFirst({
        where: {
          userId,
          tokenType,
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

  async findAll(): Promise<VerificationToken[]> {
    try {
      return await this.prisma.verificationToken.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: VerificationToken): Promise<VerificationToken> {
    try {
      return await this.prisma.verificationToken.upsert({
        where: { id: entity.id || '' },
        update: {
          tokenHash: entity.tokenHash,
          tokenType: entity.tokenType,
          expiresAt: entity.expiresAt,
          usedAt: entity.usedAt,
        },
        create: {
          userId: entity.userId,
          tokenHash: entity.tokenHash,
          tokenType: entity.tokenType,
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
      await this.prisma.verificationToken.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
