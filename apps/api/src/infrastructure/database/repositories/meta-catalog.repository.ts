import { Injectable, Inject } from '@nestjs/common';
import { MetaCatalog } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaCatalogRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findByWorkspaceId(workspaceId: string): Promise<MetaCatalog[]> {
    try {
      return await this.prisma.metaCatalog.findMany({
        where: { workspaceId, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: MetaCatalog): Promise<MetaCatalog> {
    try {
      return await this.prisma.metaCatalog.upsert({
        where: {
          externalId_provider_workspaceId: {
            externalId: entity.externalId,
            provider: entity.provider,
            workspaceId: entity.workspaceId,
          },
        },
        update: {
          name: entity.name,
          status: entity.status,
          rawPayload: entity.rawPayload as any,
          syncedAt: entity.syncedAt,
          deletedAt: entity.deletedAt,
        },
        create: {
          workspaceId: entity.workspaceId,
          organizationId: entity.organizationId,
          provider: entity.provider,
          externalId: entity.externalId,
          name: entity.name,
          status: entity.status,
          rawPayload: entity.rawPayload as any,
          syncedAt: entity.syncedAt,
          deletedAt: entity.deletedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
