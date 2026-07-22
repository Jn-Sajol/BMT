export interface CollectionCursor {
  cursorId: string
  lastCommentId?: string
  pageOffset: number
  hasMore: boolean
}

export interface CommentBatch {
  batchId: string
  targetId: string
  commentCount: number
  collectedAt: Date
  comments: Array<{
    commentId: string
    authorId: string
    text: string
    timestamp: Date
  }>
}

export interface CollectionResult {
  status: "Success" | "Partial" | "Failed" | "Skipped"
  totalCollected: number
  batches: CommentBatch[]
  cursor: CollectionCursor
  durationMs: number
}

export interface CommentCollector {
  collectorId: string
  platform: string
  collectNextBatch(targetId: string, cursor?: CollectionCursor): Promise<CollectionResult>
}
