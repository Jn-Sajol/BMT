export interface WorkflowDraft {
  id: string
  workflowId: string
  nodes: any[]
  edges: any[]
  variables: Record<string, any>
  updatedAt: string
  updatedBy: string
  versionNumber: number
}
