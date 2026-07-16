export interface RetryContext {
    correlationId: string;
    workspaceId: string;
    provider: string;
    providerAccountId: string;
    executionId?: string;
    actionId?: string;
    retryCount: number;
    maxRetries: number;
    firstFailureAt: Date;
    lastFailureAt: Date;
    nextRetryAt?: Date;
    retryPolicy: string;
    payload: any;
    metadata?: any;
}
export interface IRetryStrategy {
    policyName: string;
    calculateNextRetry(context: RetryContext): Date;
}
