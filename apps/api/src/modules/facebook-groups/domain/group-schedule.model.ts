export type GroupPublishQueueState = "Pending" | "Queued" | "Running" | "Completed" | "Failed" | "Retrying" | "Cancelled"

export interface GroupSchedule {
  id: string
  postId: string
  groupIds: string[]
  status: GroupPublishQueueState
  retryCount: number
  delayMinutes: 5 | 8 | 10 | 15
  scheduledAt: Date
  runAt?: Date
  completedAt?: Date
}
