import { Injectable, Inject } from '@nestjs/common';
import { MetaBusinessPage } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaBusinessPageRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findByWorkspaceId(workspaceId: string): Promise<MetaBusinessPage[]> {
    try {
      return await this.prisma.metaBusinessPage.findMany({
        where: { workspaceId, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: MetaBusinessPage): Promise<MetaBusinessPage> {
    try {
      return await this.prisma.metaBusinessPage.upsert({
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
