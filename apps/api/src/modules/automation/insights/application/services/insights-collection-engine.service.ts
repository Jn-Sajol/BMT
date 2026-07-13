import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IInsightsProviderRegistry } from '../../domain/ports/insights-provider-registry.interface';
import { IEventBus } from '../../../application/ports/event-bus.interface';
import { DomainEvent } from '../../../domain/models/domain-event.model';
import { PRISMA_CLIENT } from '../../../../../infrastructure/database/constants';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InsightsCollectionEngine {
  constructor(
    @Inject('IInsightsProviderRegistry')
    private readonly registry: IInsightsProviderRegistry,
    @Inject('IEventBus')
    private readonly eventBus: IEventBus,
    @Inject(PRISMA_CLIENT)
    private readonly prisma: ExtendedPrismaClient,
  ) {}

  async triggerSync(
    workspaceId: string,
    providerName: string,
    syncMode: 'FULL_SYNC' | 'INCREMENTAL_SYNC' | 'HISTORICAL_BACKFILL',
  ): Promise<any> {
    const provider = this.registry.getProvider(providerName);
    if (!provider) {
      throw new NotFoundException(`No insights provider registered for: ${providerName}`);
    }

    const syncRun = await this.prisma.automationInsightsSyncRun.create({
      data: {
        workspaceId,
        provider: providerName,
        syncMode,
        startedAt: new Date(),
        status: 'RUNNING',
      },
    });

    await this.publishEvent('Insights Sync Started', workspaceId, syncRun.id, { syncRunId: syncRun.id, providerName });

    let pagesCollected = 0;
    let rowsNormalized = 0;
    let rowsInserted = 0;
    let duplicatesSkipped = 0;
    let totalLatency = 0;
    let retryCount = 0;
    let nextCursor: string | undefined = undefined;
    let checkpoint: any = undefined;

    if (syncMode === 'INCREMENTAL_SYNC') {
      const cursorState = await this.prisma.automationInsightsSyncCursor.findUnique({
        where: {
          workspace_provider_syncMode: { workspaceId, provider: providerName, syncMode },
        },
      });
      if (cursorState) {
        nextCursor = cursorState.pageCursor || undefined;
        checkpoint = cursorState.checkpoint || undefined;
      }
    }

    try {
      let isDone = false;
      while (!isDone) {
        let attempt = 0;
        let response;
        while (attempt < 3) {
          try {
            response = await provider.collectInsights(workspaceId, syncMode, nextCursor, checkpoint);
            break;
          } catch (err: any) {
            attempt++;
            retryCount++;
            if (attempt >= 3) {
              throw err;
            }
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!response) {
          throw new Error('Failed to retrieve insights response.');
        }

        pagesCollected += response.pagesCollected;
        totalLatency += response.apiLatencyMs;
        nextCursor = response.nextCursor;
        checkpoint = response.nextCheckpoint;

        await this.publishEvent('Insights Page Collected', workspaceId, syncRun.id, { syncRunId: syncRun.id, pageNumber: pagesCollected });

        const metrics = response.metrics;
        rowsNormalized += metrics.length;
        await this.publishEvent('Insights Normalized', workspaceId, syncRun.id, { syncRunId: syncRun.id, count: metrics.length });

        for (const metric of metrics) {
          try {
            await this.prisma.automationCanonicalMetric.create({
              data: {
                workspaceId,
                provider: providerName,
                entityType: metric.entityType,
                entityId: metric.entityId,
                metricDate: metric.metricDate,
                granularity: metric.granularity,
                metricVersion: metric.metricVersion || 1,
                impressions: metric.impressions,
                clicks: metric.clicks,
                reach: metric.reach,
                frequency: metric.frequency,
                spend: metric.spend,
                cpm: metric.cpm,
                cpc: metric.cpc,
                ctr: metric.ctr,
                conversions: metric.conversions,
                videoViews: metric.videoViews,
                engagement: metric.engagement,
                rawPayload: metric.rawPayload,
                sourcePayloadHash: metric.sourcePayloadHash,
                sourceRequestId: metric.sourceRequestId,
                syncRunId: syncRun.id,
              },
            });
            rowsInserted++;
          } catch (err: any) {
            if (err.code === 'P2002') {
              duplicatesSkipped++;
            } else {
              throw err;
            }
          }
        }

        await this.publishEvent('Insights Persisted', workspaceId, syncRun.id, { syncRunId: syncRun.id, inserted: rowsInserted });

        if (!nextCursor) {
          isDone = true;
        }
      }

      await this.prisma.automationInsightsSyncCursor.upsert({
        where: {
          workspace_provider_syncMode: { workspaceId, provider: providerName, syncMode },
        },
        update: {
          lastSuccessfulSyncAt: new Date(),
          pageCursor: null,
          checkpoint: Prisma.JsonNull,
        },
        create: {
          workspaceId,
          provider: providerName,
          syncMode,
          lastSuccessfulSyncAt: new Date(),
          pageCursor: null,
          checkpoint: checkpoint ? (checkpoint as any) : Prisma.JsonNull,
        },
      });

      const updatedRun = await this.prisma.automationInsightsSyncRun.update({
        where: { id: syncRun.id },
        data: {
          status: 'SUCCESS',
          finishedAt: new Date(),
          pagesCollected,
          rowsNormalized,
          rowsInserted,
          duplicatesSkipped,
          retryCount,
          apiLatencyMs: totalLatency,
        },
      });

      await this.publishEvent('Insights Sync Completed', workspaceId, syncRun.id, { syncRunId: syncRun.id, status: 'SUCCESS' });
      return updatedRun;
    } catch (err: any) {
      if (nextCursor || checkpoint) {
        await this.prisma.automationInsightsSyncCursor.upsert({
          where: {
            workspace_provider_syncMode: { workspaceId, provider: providerName, syncMode },
          },
          update: {
            pageCursor: nextCursor || null,
            checkpoint: checkpoint ? (checkpoint as any) : Prisma.JsonNull,
          },
          create: {
            workspaceId,
            provider: providerName,
            syncMode,
            pageCursor: nextCursor || null,
            checkpoint: checkpoint ? (checkpoint as any) : Prisma.JsonNull,
          },
        });
      }

      const failedRun = await this.prisma.automationInsightsSyncRun.update({
        where: { id: syncRun.id },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          pagesCollected,
          rowsNormalized,
          rowsInserted,
          duplicatesSkipped,
          retryCount,
          apiLatencyMs: totalLatency,
          errorMessage: err.message,
        },
      });

      await this.publishEvent('Insights Sync Completed', workspaceId, syncRun.id, { syncRunId: syncRun.id, status: 'FAILED', error: err.message });
      throw err;
    }
  }

  private async publishEvent(name: string, workspaceId: string, causationId: string, payload: any) {
    const event: DomainEvent = {
      id: randomUUID(),
      name,
      workspaceId,
      payload,
      triggerVersion: '1.0',
      source: 'Insights Engine',
      correlationId: randomUUID(),
      causationId,
      occurredAt: new Date(),
      receivedAt: new Date(),
      processedAt: new Date(),
      timestamp: new Date(),
    };
    await this.eventBus.publish(event);
  }
}
