export declare class SyncInsightsDto {
    datePreset?: string;
    since?: string;
    until?: string;
}
export declare class CampaignInsightResponseDto {
    id: string;
    workspaceId: string;
    campaignId: string;
    facebookObjectId: string;
    provider: string;
    date: string;
    impressions: number;
    reach: number;
    frequency: number;
    clicks: number;
    spend: number;
    purchase: number;
    purchaseValue: number;
    syncedAt: string;
}
export declare class AdSetInsightResponseDto {
    id: string;
    workspaceId: string;
    adSetId: string;
    facebookObjectId: string;
    provider: string;
    date: string;
    impressions: number;
    reach: number;
    frequency: number;
    clicks: number;
    spend: number;
    purchase: number;
    purchaseValue: number;
    syncedAt: string;
}
export declare class AdInsightResponseDto {
    id: string;
    workspaceId: string;
    adId: string;
    facebookObjectId: string;
    provider: string;
    date: string;
    impressions: number;
    reach: number;
    frequency: number;
    clicks: number;
    spend: number;
    purchase: number;
    purchaseValue: number;
    syncedAt: string;
}
export declare class SyncHistoryResponseDto {
    id: string;
    workspaceId: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    recordsProcessed: number;
    recordsCreated: number;
    recordsUpdated: number;
    duration?: number;
    errorMessage?: string;
}
