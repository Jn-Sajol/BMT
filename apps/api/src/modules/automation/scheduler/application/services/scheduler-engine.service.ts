import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISchedulerEngine } from '../../domain/ports/scheduler.interface';
import { ISchedulerLock } from '../../domain/ports/scheduler-lock.interface';
import { ITimezoneConverter } from '../../domain/ports/timezone-converter.interface';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { randomUUID } from 'crypto';

@Injectable()
export class SchedulerEngine implements ISchedulerEngine {
  constructor(
    @Inject('ISchedulerLock')
    private readonly lockService: ISchedulerLock,
    @Inject('ITimezoneConverter')
    private readonly timezoneService: ITimezoneConverter,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async triggerSchedule(scheduleId: string, nodeId: string): Promise<void> {
    const schedule = await this.prisma.automationSchedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule || schedule.status !== 'ACTIVE') {
      return;
    }

    const leaseMs = 30000;
    const acquired = await this.lockService.acquireLock(scheduleId, nodeId, leaseMs);
    if (!acquired) {
      return;
    }

    const correlationId = randomUUID();
    const startedAt = new Date();

    const execution = await this.prisma.automationScheduleExecution.create({
      data: {
        workspaceId: schedule.workspaceId,
        scheduleId,
        correlationId,
        nodeId,
        status: 'RUNNING',
        startedAt,
      },
    });

    try {
      const event: DomainEvent = {
        id: randomUUID(),
        name: 'Schedule Triggered',
        workspaceId: schedule.workspaceId,
        payload: {
          entityId: schedule.ruleId,
          scheduleId,
          ruleId: schedule.ruleId,
          workspaceId: schedule.workspaceId,
          provider: 'Scheduler',
          correlationId,
          triggerType: 'SCHEDULE',
          scheduledTime: schedule.nextRunAtUtc || startedAt,
        },
        triggerVersion: '1.0',
        source: 'Scheduler Engine',
        correlationId,
        causationId: execution.id,
        occurredAt: new Date(),
        receivedAt: new Date(),
        processedAt: new Date(),
        timestamp: new Date(),
      };

      await this.eventBus.publish(event);

      const completedAt = new Date();
      const durationMs = completedAt.getTime() - startedAt.getTime();

      const nextRunAt = this.timezoneService.calculateNextRun(
        schedule.cronExpression || '0 * * * *',
        schedule.timezone,
        completedAt,
      );

      await this.prisma.automationScheduleExecution.update({
        where: { id: execution.id },
        data: {
          status: 'SUCCESS',
          completedAt,
          durationMs,
        },
      });

      await this.prisma.automationSchedule.update({
        where: { id: scheduleId },
        data: {
          lastRunAtUtc: startedAt,
          nextRunAtUtc: nextRunAt,
        },
      });
    } catch (err: any) {
      const completedAt = new Date();
      const durationMs = completedAt.getTime() - startedAt.getTime();

      await this.prisma.automationScheduleExecution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          completedAt,
          durationMs,
          error: err.message,
        },
      });
    } finally {
      await this.lockService.releaseLock(scheduleId, nodeId);
    }
  }

  async pauseSchedule(scheduleId: string): Promise<void> {
    const schedule = await this.prisma.automationSchedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${scheduleId} not found.`);
    }

    await this.prisma.automationSchedule.update({
      where: { id: scheduleId },
      data: { status: 'PAUSED' },
    });
  }

  async resumeSchedule(scheduleId: string): Promise<void> {
    const schedule = await this.prisma.automationSchedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${scheduleId} not found.`);
    }

    const nextRun = this.timezoneService.calculateNextRun(
      schedule.cronExpression || '0 * * * *',
      schedule.timezone,
      new Date(),
    );

    await this.prisma.automationSchedule.update({
      where: { id: scheduleId },
      data: {
        status: 'ACTIVE',
        nextRunAtUtc: nextRun,
      },
    });
  }
}
