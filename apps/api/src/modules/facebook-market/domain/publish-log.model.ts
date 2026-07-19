export interface PublishLog {
  id: string
  requestId: string
  accountId: string
  pageId?: string
  publishTime: Date
  facebookPostId?: string
  status: "success" | "failed"
  failureReason?: string
  executionDurationMs: number
}
