import { Injectable } from '@nestjs/common';
import { IInsightsProvider, NormalizedMetric } from '../../domain/ports/insights-provider.interface';
import { createHash } from 'crypto';

@Injectable()
export class MetaInsightsProvider implements IInsightsProvider {
  providerName = 'Meta';

  async authenticate(workspaceId: string): Promise<boolean> {
    return true;
  }

  async collectInsights(
    workspaceId: string,
    syncMode: string,
    cursor?: string,
    checkpoint?: any,
  ): Promise<{
    metrics: NormalizedMetric[];
    nextCursor?: string;
    nextCheckpoint?: any;
    apiLatencyMs: number;
    pagesCollected: number;
  }> {
    const latStart = Date.now();
    const mockRequestId = `req_${Math.random().toString(36).substring(7)}`;

    const metrics: NormalizedMetric[] = [
      {
        entityType: 'CAMPAIGN',
        entityId: 'camp_12345',
        metricDate: new Date(),
        granularity: 'DAILY',
        metricVersion: 1,
        impressions: 12000,
        clicks: 340,
        reach: 9800,
        frequency: 1.2,
        spend: 150.0,
        cpm: 12.5,
        cpc: 0.44,
        ctr: 0.028,
        conversions: 12,
        videoViews: 4500,
        engagement: 600,
        rawPayload: { impressions: 12000, spend: 150.0 },
        sourcePayloadHash: createHash('sha256').update(JSON.stringify({ impressions: 12000, spend: 150.0 })).digest('hex'),
        sourceRequestId: mockRequestId,
      },
    ];

    const nextCursor = cursor === 'page1' ? undefined : 'page1';

    return {
      metrics,
      nextCursor,
      nextCheckpoint: nextCursor ? { page: 2 } : undefined,
      apiLatencyMs: Date.now() - latStart,
      pagesCollected: 1,
    };
  }

  supportsIncrementalSync(): boolean {
    return true;
  }

  supportsHistoricalSync(): boolean {
    return true;
  }
}
