import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../constants';
import { ExtendedPrismaClient } from '../prisma-extensions';
import { mapPrismaError } from '../prisma-error.mapper';
import { Job, JobHistory, DistributedLock } from '@prisma/client';

@Injectable()
export class JobRepository {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async createJob(
    name: string,
    provider: string,
    payload: any,
    cron: string | null,
    correlationId: string,
    runAt: Date,
  ): Promise<Job> {
    try {
      return await this.prisma.job.create({
        data: {
          name,
          provider,
          payload,
          cron,
          correlationId,
          runAt,
          status: 'PENDING',
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findPendingJobs(now: Date): Promise<Job[]> {
    try {
      return await this.prisma.job.findMany({
        where: {
          status: 'PENDING',
          runAt: { lte: now },
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async updateJobStatus(
    id: string,
    status: string,
    attempts: number,
    errorMessage: string | null,
    runAt: Date,
    lastRunAt: Date | null,
  ): Promise<Job> {
    try {
      return await this.prisma.job.update({
        where: { id },
        data: {
          status,
          attempts,
          errorMessage,
          runAt,
          lastRunAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async insertHistory(
    jobId: string,
    status: string,
    attempt: number,
    errorMessage: string | null,
    duration: number,
    startedAt: Date,
    finishedAt: Date,
  ): Promise<JobHistory> {
    try {
      return await this.prisma.jobHistory.create({
        data: {
          jobId,
          status,
          attempt,
          errorMessage,
          duration,
          startedAt,
          finishedAt,
        },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async cancelJob(id: string): Promise<Job> {
    try {
      return await this.prisma.job.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async findById(id: string): Promise<Job | null> {
    try {
      return await this.prisma.job.findUnique({
        where: { id },
      });
    } catch (e) {
      throw mapPrismaError(e) as Error;
    }
  }

  async acquireLock(lockKey: string, lockedBy: string, durationSeconds: number): Promise<boolean> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationSeconds * 1000);

      return await this.prisma.$transaction(async (tx) => {
        const existing = await tx.distributedLock.findUnique({
          where: { lockKey },
        });

        if (existing && existing.expiresAt > now) {
          return false;
        }

        await tx.distributedLock.upsert({
          where: { lockKey },
          update: {
            lockedBy,
            expiresAt,
          },
          create: {
            lockKey,
            lockedBy,
            expiresAt,
          },
        });

        return true;
      });
    } catch (e) {
      return false;
    }
  }

  async releaseLock(lockKey: string, lockedBy: string): Promise<void> {
    try {
      await this.prisma.distributedLock.deleteMany({
        where: {
          lockKey,
          lockedBy,
        },
      });
    } catch (e) {
      // Ignore release errors
    }
  }
}
