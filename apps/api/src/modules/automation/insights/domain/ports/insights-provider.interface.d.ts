export interface NormalizedMetric {
    entityType: 'CAMPAIGN' | 'ADSET' | 'AD';
    entityId: string;
    metricDate: Date;
    granularity: string;
    metricVersion?: number;
    impressions: number;
    clicks: number;
    reach: number;
    frequency: number;
    spend: number;
    cpm: number;
    cpc: number;
    ctr: number;
    conversions: number;
    videoViews: number;
    engagement: number;
    rawPayload?: any;
    sourcePayloadHash: string;
    sourceRequestId: string;
}
export interface IInsightsProvider {
    providerName: string;
    authenticate(workspaceId: string): Promise<boolean>;
    collectInsights(workspaceId: string, syncMode: string, cursor?: string, checkpoint?: any): Promise<{
        metrics: NormalizedMetric[];
        nextCursor?: string;
        nextCheckpoint?: any;
        apiLatencyMs: number;
        pagesCollected: number;
    }>;
    supportsIncrementalSync(): boolean;
    supportsHistoricalSync(): boolean;
}
