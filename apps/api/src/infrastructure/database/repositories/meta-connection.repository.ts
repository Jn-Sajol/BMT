import { Injectable, Inject } from '@nestjs/common';
import { MetaConnection } from '@prisma/client';
import { IMetaConnectionRepository } from '../../../common/ports/identity/meta-connection-repository.interface';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaConnectionRepository implements IMetaConnectionRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<MetaConnection | null> {
    try {
      return await this.prisma.metaConnection.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<MetaConnection | null> {
    try {
      return await this.prisma.metaConnection.findUnique({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: 'meta',
          },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByFacebookUserId(facebookUserId: string): Promise<MetaConnection | null> {
    try {
      return await this.prisma.metaConnection.findFirst({
        where: { facebookUserId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findAll(): Promise<MetaConnection[]> {
    try {
      return await this.prisma.metaConnection.findMany();
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: MetaConnection): Promise<MetaConnection> {
    try {
      return await this.prisma.metaConnection.upsert({
        where: { id: entity.id || '' },
        update: {
          facebookUserId: entity.facebookUserId,
          facebookUserName: entity.facebookUserName,
          encryptedAccessToken: entity.encryptedAccessToken,
          expiresAt: entity.expiresAt,
          grantedScopes: entity.grantedScopes as any,
          status: entity.status,
          lastValidatedAt: entity.lastValidatedAt,
          connectionVersion: entity.connectionVersion,
        },
        create: {
          facebookUserId: entity.facebookUserId,
          facebookUserName: entity.facebookUserName,
          encryptedAccessToken: entity.encryptedAccessToken,
          expiresAt: entity.expiresAt,
          grantedScopes: entity.grantedScopes as any,
          provider: entity.provider,
          status: entity.status,
          connectedBy: entity.connectedBy,
          organizationId: entity.organizationId,
          workspaceId: entity.workspaceId,
          lastValidatedAt: entity.lastValidatedAt,
          connectionVersion: entity.connectionVersion,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.metaConnection.delete({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
