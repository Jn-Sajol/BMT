import { Injectable, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { EventUpcasterRegistry } from '../upcasters/event-upcaster.registry';

@Injectable()
export class ProjectionService {
  constructor(
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
    private readonly upcasterRegistry: EventUpcasterRegistry,
  ) {}

  async projectEvent(event: DomainEvent): Promise<void> {
    const rawPayload = event.payload || {};
    const currentVersion = event.eventVersion || '1.0';
    const provider = event.provider || 'Meta';
    
    // Upcast schema dynamically by provider
    const upcastedPayload = this.upcasterRegistry.upcast(
      provider,
      event.name,
      rawPayload,
      currentVersion,
      '2.0',
    );

    const payload = upcastedPayload || {};
    const { ruleId, status, durationMs } = payload;
    const workspaceId = event.workspaceId;

    switch (event.name) {
      case 'Trigger Matched': {
        const triggerType = payload.triggerType || 'unknown';
        await this.prisma.automationTriggerPerformanceProjection.upsert({
          where: {
            workspaceId_triggerType: { workspaceId, triggerType },
          },
          update: {
            matchedCount: { increment: 1 },
            lastMatchedAt: event.occurredAt,
          },
          create: {
            workspaceId,
            triggerType,
            matchedCount: 1,
            lastMatchedAt: event.occurredAt,
          },
        });
        break;
      }

      case 'Action Completed': {
        const result = payload.result || {};
        const actionName = result.executorName || 'unknown';
        const isSuccess = result.status === 'SUCCESS';
        const actDuration = Number(result.duration || 0);

        const proj = await this.prisma.automationActionPerformanceProjection.findUnique({
          where: {
            workspaceId_actionType: { workspaceId, actionType: actionName },
          },
        });

        const newCount = (proj?.executionsCount || 0) + 1;
        const newAvg = proj
          ? (proj.averageDurationMs * proj.executionsCount + actDuration) / newCount
          : actDuration;

        await this.prisma.automationActionPerformanceProjection.upsert({
          where: {
            workspaceId_actionType: { workspaceId, actionType: actionName },
          },
          update: {
            executionsCount: { increment: 1 },
            successCount: { increment: isSuccess ? 1 : 0 },
            failedCount: { increment: !isSuccess ? 1 : 0 },
            averageDurationMs: newAvg,
          },
          create: {
            workspaceId,
            actionType: actionName,
            executionsCount: 1,
            successCount: isSuccess ? 1 : 0,
            failedCount: !isSuccess ? 1 : 0,
            averageDurationMs: actDuration,
          },
        });
        break;
      }

      case 'Execution Completed': {
        const isSuccess = status === 'SUCCESS' || status === 'PARTIAL_SUCCESS';
        const dur = Number(durationMs || 0);

        // 1. Rule Performance
        const ruleProj = await this.prisma.automationRulePerformanceProjection.findUnique({
          where: { ruleId },
        });
        const ruleName = ruleProj?.name || `Rule ${ruleId}`;
        const newRuleCount = (ruleProj?.executionsCount || 0) + 1;
        const newRuleAvg = ruleProj
          ? (ruleProj.averageDurationMs * ruleProj.executionsCount + dur) / newRuleCount
          : dur;

        await this.prisma.automationRulePerformanceProjection.upsert({
          where: { ruleId },
          update: {
            executionsCount: { increment: 1 },
            successCount: { increment: isSuccess ? 1 : 0 },
            failedCount: { increment: !isSuccess ? 1 : 0 },
            lastExecutedAt: event.occurredAt,
            averageDurationMs: newRuleAvg,
          },
          create: {
            ruleId,
            workspaceId,
            name: ruleName,
            executionsCount: 1,
            successCount: isSuccess ? 1 : 0,
            failedCount: !isSuccess ? 1 : 0,
            lastExecutedAt: event.occurredAt,
            averageDurationMs: dur,
          },
        });

        // 2. Execution Performance
        await this.prisma.automationExecutionPerformanceProjection.upsert({
          where: { correlationId: event.correlationId },
          update: {
            status,
            durationMs: dur,
            completedAt: event.occurredAt,
          },
          create: {
            workspaceId,
            correlationId: event.correlationId,
            ruleId,
            status,
            durationMs: dur,
            startedAt: event.receivedAt || event.occurredAt,
            completedAt: event.occurredAt,
          },
        });

        // 3. Aggregation Update
        await this.updateAggregatedStats(workspaceId, ruleId, isSuccess, dur, event.occurredAt);
        break;
      }
    }
  }

  async rebuildProjections(workspaceId: string): Promise<void> {
    await this.prisma.automationRulePerformanceProjection.deleteMany({ where: { workspaceId } });
    await this.prisma.automationActionPerformanceProjection.deleteMany({ where: { workspaceId } });
    await this.prisma.automationTriggerPerformanceProjection.deleteMany({ where: { workspaceId } });
    await this.prisma.automationExecutionPerformanceProjection.deleteMany({ where: { workspaceId } });
    await this.prisma.automationAggregatedStats.deleteMany({ where: { workspaceId } });

    const events = await this.prisma.automationTimelineEvent.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'asc' },
    });

    for (const evt of events) {
      const event: DomainEvent = {
        id: evt.id,
        name: evt.eventName,
        workspaceId: evt.workspaceId,
        payload: evt.payload as any,
        triggerVersion: '1.0',
        eventVersion: evt.eventVersion || '1.0',
        provider: evt.provider || 'Meta',
        source: 'Event Store',
        correlationId: evt.correlationId,
        causationId: evt.causationId,
        occurredAt: evt.createdAt,
        receivedAt: evt.createdAt,
        processedAt: evt.createdAt,
        timestamp: evt.createdAt,
      };
      await this.projectEvent(event);
    }
  }

  private async updateAggregatedStats(
    workspaceId: string,
    ruleId: string,
    isSuccess: boolean,
    durationMs: number,
    occurredAt: Date,
  ) {
    const dates = this.getPeriodsTimestamps(occurredAt);
    for (const item of dates) {
      await this.prisma.automationAggregatedStats.upsert({
        where: {
          workspaceId_ruleId_period_timestamp: {
            workspaceId,
            ruleId,
            period: item.period,
            timestamp: item.timestamp,
          },
        },
        update: {
          executionsCount: { increment: 1 },
          successCount: { increment: isSuccess ? 1 : 0 },
          failedCount: { increment: !isSuccess ? 1 : 0 },
        },
        create: {
          workspaceId,
          ruleId,
          period: item.period,
          timestamp: item.timestamp,
          executionsCount: 1,
          successCount: isSuccess ? 1 : 0,
          failedCount: !isSuccess ? 1 : 0,
          averageDurationMs: durationMs,
        },
      });
    }
  }

  private getPeriodsTimestamps(date: Date) {
    const d = new Date(date);
    const daily = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
    const weekly = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
    const monthly = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));

    return [
      { period: 'DAILY', timestamp: daily },
      { period: 'WEEKLY', timestamp: weekly },
      { period: 'MONTHLY', timestamp: monthly },
    ];
  }
}
