import { Injectable, Inject } from '@nestjs/common';
import { MetaSyncHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class MetaSyncHistoryRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findLatestByWorkspaceId(workspaceId: string): Promise<MetaSyncHistory | null> {
    try {
      return await this.prisma.metaSyncHistory.findFirst({
        where: { workspaceId },
        orderBy: { startedAt: 'desc' },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: MetaSyncHistory): Promise<MetaSyncHistory> {
    try {
      return await this.prisma.metaSyncHistory.upsert({
        where: { id: entity.id || '' },
        update: {
          finishedAt: entity.finishedAt,
          duration: entity.duration,
          assetCount: entity.assetCount,
          status: entity.status,
          error: entity.error,
        },
        create: {
          workspaceId: entity.workspaceId,
          organizationId: entity.organizationId,
          startedAt: entity.startedAt,
          finishedAt: entity.finishedAt,
          duration: entity.duration,
          assetCount: entity.assetCount,
          status: entity.status,
          error: entity.error,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
