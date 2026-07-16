export interface ICircuitBreaker {
    checkCallAllowed(provider: string, accountId: string, workspaceId: string): Promise<boolean>;
    recordSuccess(provider: string, accountId: string, workspaceId: string): Promise<void>;
    recordFailure(provider: string, accountId: string, workspaceId: string): Promise<void>;
    resetBreaker(provider: string, accountId: string, workspaceId: string): Promise<void>;
    getBreakerState(provider: string, accountId: string, workspaceId: string): Promise<string>;
}
