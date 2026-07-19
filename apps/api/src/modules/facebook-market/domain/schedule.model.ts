export type PublishQueueState = "Pending" | "Running" | "Completed" | "Failed" | "Retrying" | "Cancelled"

export interface PostSchedule {
  id: string
  postId: string
  status: PublishQueueState
  retryCount: number
  scheduledAt: Date
  runAt?: Date
  completedAt?: Date
}
