import { Injectable, Inject } from '@nestjs/common';
import { ISchedulerLock } from '../../domain/ports/scheduler-lock.interface';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';

@Injectable()
export class DistributedLockService implements ISchedulerLock {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async acquireLock(scheduleId: string, nodeId: string, leaseMs: number): Promise<boolean> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + leaseMs);

    try {
      await this.prisma.automationScheduleLock.create({
        data: {
          scheduleId,
          ownerNodeId: nodeId,
          leaseExpiresAt: expiresAt,
        },
      });
      return true;
    } catch {
      try {
        const result = await this.prisma.automationScheduleLock.updateMany({
          where: {
            scheduleId,
            leaseExpiresAt: { lte: now },
          },
          data: {
            ownerNodeId: nodeId,
            leaseExpiresAt: expiresAt,
          },
        });
        return result.count > 0;
      } catch {
        return false;
      }
    }
  }

  async renewLock(scheduleId: string, nodeId: string, leaseMs: number): Promise<boolean> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + leaseMs);

    try {
      const result = await this.prisma.automationScheduleLock.updateMany({
        where: {
          scheduleId,
          ownerNodeId: nodeId,
        },
        data: {
          leaseExpiresAt: expiresAt,
        },
      });
      return result.count > 0;
    } catch {
      return false;
    }
  }

  async releaseLock(scheduleId: string, nodeId: string): Promise<void> {
    try {
      await this.prisma.automationScheduleLock.deleteMany({
        where: {
          scheduleId,
          ownerNodeId: nodeId,
        },
      });
    } catch {
      // Ignore if lock was already cleaned up or expired
    }
  }
}
