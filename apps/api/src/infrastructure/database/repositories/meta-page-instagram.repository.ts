import { Injectable, Inject } from '@nestjs/common';
import { MetaPageInstagram } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaPageInstagramRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findByWorkspaceId(workspaceId: string): Promise<MetaPageInstagram[]> {
    try {
      return await this.prisma.metaPageInstagram.findMany({
        where: { workspaceId, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: MetaPageInstagram): Promise<MetaPageInstagram> {
    try {
      return await this.prisma.metaPageInstagram.upsert({
        where: {
          source_target_provider_workspace: {
            sourceExternalId: entity.sourceExternalId,
            targetExternalId: entity.targetExternalId,
            provider: entity.provider,
            workspaceId: entity.workspaceId,
          },
        },
        update: {
          status: entity.status,
          syncedAt: entity.syncedAt,
          deletedAt: entity.deletedAt,
        },
        create: {
          workspaceId: entity.workspaceId,
          organizationId: entity.organizationId,
          provider: entity.provider,
          sourceExternalId: entity.sourceExternalId,
          targetExternalId: entity.targetExternalId,
          status: entity.status,
          syncedAt: entity.syncedAt,
          deletedAt: entity.deletedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
