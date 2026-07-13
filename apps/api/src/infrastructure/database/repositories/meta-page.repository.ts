import { Injectable, Inject } from '@nestjs/common';
import { MetaPage } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaPageRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<MetaPage | null> {
    try {
      return await this.prisma.metaPage.findFirst({
        where: { id, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findByWorkspaceId(workspaceId: string): Promise<MetaPage[]> {
    try {
      return await this.prisma.metaPage.findMany({
        where: { workspaceId, deletedAt: null },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: MetaPage): Promise<MetaPage> {
    try {
      return await this.prisma.metaPage.upsert({
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
