export interface GroupPublishLog {
  id: string
  requestId: string
  groupName: string
  accountId: string
  postId: string
  publishTime: Date
  facebookPostId?: string
  executionDurationMs: number
  status: "success" | "failed"
  errorMessage?: string
}
