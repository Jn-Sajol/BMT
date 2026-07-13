import { Injectable, Inject } from '@nestjs/common';
import { UserInvitation } from '@prisma/client';
import { IUserInvitationRepository } from '../../../common/ports/user-invitation-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class UserInvitationRepository implements IUserInvitationRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<UserInvitation | null> {
    try {
      return await this.prisma.userInvitation.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<UserInvitation | null> {
    try {
      return await this.prisma.userInvitation.findUnique({ where: { tokenHash } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findPendingByEmail(email: string): Promise<UserInvitation[]> {
    try {
      return await this.prisma.userInvitation.findMany({
        where: {
          email,
          status: 'PENDING',
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<UserInvitation[]> {
    try {
      return await this.prisma.userInvitation.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: UserInvitation): Promise<UserInvitation> {
    try {
      return await this.prisma.userInvitation.upsert({
        where: { id: entity.id || '' },
        update: {
          email: entity.email,
          tenantId: entity.tenantId,
          workspaceId: entity.workspaceId,
          roleId: entity.roleId,
          tokenHash: entity.tokenHash,
          status: entity.status,
          expiresAt: entity.expiresAt,
        },
        create: {
          email: entity.email,
          tenantId: entity.tenantId,
          workspaceId: entity.workspaceId,
          roleId: entity.roleId,
          tokenHash: entity.tokenHash,
          status: entity.status,
          expiresAt: entity.expiresAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.userInvitation.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
