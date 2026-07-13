import { Injectable, Inject } from '@nestjs/common';
import { InsightSyncHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class InsightSyncHistoryRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<InsightSyncHistory | null> {
    try {
      return await this.prisma.insightSyncHistory.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findLatestByWorkspaceId(workspaceId: string): Promise<InsightSyncHistory | null> {
    try {
      return await this.prisma.insightSyncHistory.findFirst({
        where: { workspaceId },
        orderBy: { startedAt: 'desc' },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: InsightSyncHistory): Promise<InsightSyncHistory> {
    try {
      return await this.prisma.insightSyncHistory.upsert({
        where: { id: entity.id || '' },
        update: {
          status: entity.status,
          finishedAt: entity.finishedAt,
          recordsProcessed: entity.recordsProcessed,
          recordsCreated: entity.recordsCreated,
          recordsUpdated: entity.recordsUpdated,
          duration: entity.duration,
          errorMessage: entity.errorMessage,
        },
        create: {
          workspaceId: entity.workspaceId,
          status: entity.status,
          startedAt: entity.startedAt,
          finishedAt: entity.finishedAt,
          recordsProcessed: entity.recordsProcessed,
          recordsCreated: entity.recordsCreated,
          recordsUpdated: entity.recordsUpdated,
          duration: entity.duration,
          errorMessage: entity.errorMessage,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
