import { Injectable, OnApplicationBootstrap, OnApplicationShutdown, Inject } from '@nestjs/common';
import { SchedulerEngine } from './scheduler-engine.service';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { randomUUID } from 'crypto';
import * as os from 'os';

@Injectable()
export class SchedulerLoop implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly nodeId = `node-${randomUUID()}`;
  private heartbeatTimer?: NodeJS.Timeout;
  private pollTimer?: NodeJS.Timeout;
  private isShuttingDown = false;

  constructor(
    private readonly engine: SchedulerEngine,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async onApplicationBootstrap() {
    this.isShuttingDown = false;

    await this.prisma.automationSchedulerNode.create({
      data: {
        id: this.nodeId,
        hostname: os.hostname(),
        processId: process.pid,
        heartbeatAt: new Date(),
        version: '1.0.0',
        status: 'ACTIVE',
      },
    });

    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), 10000);
    this.pollTimer = setInterval(() => this.pollSchedules(), 5000);
  }

  async onApplicationShutdown() {
    this.isShuttingDown = true;
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.pollTimer) clearInterval(this.pollTimer);

    try {
      await this.prisma.automationSchedulerNode.update({
        where: { id: this.nodeId },
        data: { status: 'INACTIVE', heartbeatAt: new Date() },
      });
    } catch {
      // Ignored during shutdown bounds
    }
  }

  private async sendHeartbeat() {
    if (this.isShuttingDown) return;
    try {
      await this.prisma.automationSchedulerNode.update({
        where: { id: this.nodeId },
        data: { heartbeatAt: new Date() },
      });
    } catch {
      // Heartbeat resilient update retry
    }
  }

  private async pollSchedules() {
    if (this.isShuttingDown) return;
    const now = new Date();

    try {
      const dueSchedules = await this.prisma.automationSchedule.findMany({
        where: {
          status: 'ACTIVE',
          nextRunAtUtc: { lte: now },
        },
      });

      for (const schedule of dueSchedules) {
        this.engine.triggerSchedule(schedule.id, this.nodeId).catch(() => {
          // Silent catch since execution state is already persisted
        });
      }
    } catch {
      // Prevents DB connection failure from blocking the loop node
    }
  }

  getNodeId(): string {
    return this.nodeId;
  }
}
