export interface ActionExecutionContext {
    actionId: string;
    correlationId: string;
    workspaceId: string;
    userId: string;
    dryRun: boolean;
}
export interface ActionExecutionResult {
    actionId: string;
    executorName: string;
    status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
    startedAt: Date;
    completedAt: Date;
    duration: number;
    retryable: boolean;
    correlationId: string;
    explainability: any;
    error?: string;
}
export interface IActionExecutor {
    actionType: string;
    execute(params: any, context: ActionExecutionContext): Promise<ActionExecutionResult>;
}
