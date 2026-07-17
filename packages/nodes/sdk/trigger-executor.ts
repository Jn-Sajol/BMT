export interface TriggerExecutionContext {
  workflowId: string
  triggerId: string
  workspaceId: string
  correlationId: string
  payload: Record<string, any>
  scheduledTime?: string
}

export interface TriggerExecutor {
  validateConfig: (config: Record<string, any>) => { success: boolean; errors?: any }
  execute: (context: TriggerExecutionContext, config: Record<string, any>) => Promise<any>
}
