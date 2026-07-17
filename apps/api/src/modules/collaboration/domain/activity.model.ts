export interface Activity {
  id: string
  workspaceId: string
  workflowId: string
  userId: string
  role: string
  action: string
  timestamp: string
  correlationId: string
}
