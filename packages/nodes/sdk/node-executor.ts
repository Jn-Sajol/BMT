export interface WorkflowExecutionContext {
  workflowId: string
  executionId: string
  variables: Record<string, any>
  nodeOutputs: Record<string, any>
  logs: string[]
  log: (message: string) => void
  resolveVariables: (text: string) => string
}

export interface NodeExecutor {
  initialize?: (context: WorkflowExecutionContext) => Promise<void>
  validate: (properties: Record<string, any>) => { success: boolean; errors?: any }
  execute: (context: WorkflowExecutionContext, properties: Record<string, any>) => Promise<any>
  cleanup?: (context: WorkflowExecutionContext) => Promise<void>
}
