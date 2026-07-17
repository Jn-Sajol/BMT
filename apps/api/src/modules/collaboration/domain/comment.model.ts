export interface Comment {
  id: string
  workflowId: string
  nodeId: string | null
  author: string
  content: string
  createdAt: string
  parentCommentId: string | null
  isResolved: boolean
}
