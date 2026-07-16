export interface RequestContextStore {
    correlationId: string;
    workspaceId?: string;
    userId?: string;
    requestId?: string;
}
export declare class CorrelationService {
    private static readonly asyncLocalStorage;
    runWithContext(store: RequestContextStore, callback: () => any): any;
    getStore(): RequestContextStore | undefined;
    getCorrelationId(): string;
    getWorkspaceId(): string | undefined;
    getUserId(): string | undefined;
    getRequestId(): string | undefined;
}
