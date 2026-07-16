import { IInsightsProvider, NormalizedMetric } from '../../domain/ports/insights-provider.interface';
export declare class MetaInsightsProvider implements IInsightsProvider {
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
