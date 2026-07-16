export declare class StatusSyncHistoryDto {
    id: string;
    workspaceId: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    recordsProcessed: number;
    recordsUpdated: number;
    duration?: number;
    errorMessage?: string;
}
