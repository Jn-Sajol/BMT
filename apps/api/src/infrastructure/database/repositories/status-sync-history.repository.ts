import { Injectable, Inject } from '@nestjs/common';
import { StatusSyncHistory } from '@prisma/client';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';

@Injectable()
export class StatusSyncHistoryRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async findById(id: string): Promise<StatusSyncHistory | null> {
    try {
      return await this.prisma.statusSyncHistory.findUnique({ where: { id } });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findHistoryByWorkspaceId(workspaceId: string): Promise<StatusSyncHistory[]> {
    try {
      return await this.prisma.statusSyncHistory.findMany({
        where: { workspaceId },
        orderBy: { startedAt: 'desc' },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async save(entity: StatusSyncHistory): Promise<StatusSyncHistory> {
    try {
      return await this.prisma.statusSyncHistory.upsert({
        where: { id: entity.id || '' },
        update: {
          status: entity.status,
          finishedAt: entity.finishedAt,
          recordsProcessed: entity.recordsProcessed,
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
