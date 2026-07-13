import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { MetaOutboxJob } from '@prisma/client';
import { IClockProvider } from '../../../common/ports/clock-provider.interface';
import { CLOCK_PROVIDER } from '../../security/security.module';

@Injectable()
export class MetaOutboxRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async createJob(
    jobData: Omit<
      MetaOutboxJob,
      'id' | 'status' | 'attempts' | 'processedAt' | 'completedAt' | 'failedAt' | 'lastError' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<MetaOutboxJob> {
    try {
      return await this.prisma.metaOutboxJob.create({
        data: {
          ...jobData,
          payload: jobData.payload as any,
          status: 'PENDING',
          attempts: 0,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async loadJob(id: string, workspaceId: string): Promise<MetaOutboxJob | null> {
    try {
      return await this.prisma.metaOutboxJob.findFirst({
        where: { id, workspaceId },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findPendingJobs(limit: number = 100): Promise<MetaOutboxJob[]> {
    try {
      const now = this.clockProvider.now();
      return await this.prisma.metaOutboxJob.findMany({
        where: {
          status: 'PENDING',
          nextRunAt: { lte: now },
        },
        orderBy: [
          { priority: 'desc' },
          { nextRunAt: 'asc' },
        ],
        take: limit,
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async markProcessing(id: string, workspaceId: string): Promise<MetaOutboxJob> {
    try {
      const now = this.clockProvider.now();
      return await this.prisma.$transaction(async (tx) => {
        const job = await tx.metaOutboxJob.findFirst({
          where: { id, workspaceId },
        });
        if (!job) {
          throw new Error(`Job not found or access denied: ${id}`);
        }

        return await tx.metaOutboxJob.update({
          where: { id },
          data: {
            status: 'PROCESSING',
            attempts: job.attempts + 1,
            processedAt: now,
          },
        });
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async markSuccess(id: string, workspaceId: string): Promise<MetaOutboxJob> {
    try {
      const now = this.clockProvider.now();
      return await this.prisma.metaOutboxJob.update({
        where: { id, workspaceId },
        data: {
          status: 'SUCCESS',
          completedAt: now,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async markFailed(id: string, workspaceId: string, error: string, nextRunAt: Date): Promise<MetaOutboxJob> {
    try {
      const now = this.clockProvider.now();
      return await this.prisma.metaOutboxJob.update({
        where: { id, workspaceId },
        data: {
          status: 'FAILED',
          failedAt: now,
          lastError: error,
          nextRunAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async moveDeadLetter(id: string, workspaceId: string, error: string): Promise<MetaOutboxJob> {
    try {
      const now = this.clockProvider.now();
      return await this.prisma.metaOutboxJob.update({
        where: { id, workspaceId },
        data: {
          status: 'DEAD_LETTER',
          failedAt: now,
          lastError: error,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async cancelJob(id: string, workspaceId: string): Promise<MetaOutboxJob> {
    try {
      return await this.prisma.metaOutboxJob.update({
        where: { id, workspaceId },
        data: {
          status: 'CANCELLED',
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }
}
