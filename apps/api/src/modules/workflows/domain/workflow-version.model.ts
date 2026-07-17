export interface WorkflowVersion {
  id: string
  workflowId: string
  versionNumber: number
  author: string
  createdAt: string
  publishedAt: string
  parentVersionId: string | null
  rollbackSourceVersionNumber: number | null
  contentHash: string
  changeSummary: string
  nodes: any[]
  edges: any[]
  variables: Record<string, any>
}
