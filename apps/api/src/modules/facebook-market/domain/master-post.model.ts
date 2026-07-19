import { PostAsset } from "./post-asset.model"
import { PostTarget } from "./post-target.model"

export type SchedulerState = "Draft" | "Scheduled" | "Publishing" | "Published" | "Failed" | "Cancelled"

export interface MasterPost {
  id: string
  title: string
  description: string
  assets: PostAsset[]
  targets: PostTarget[]
  status: SchedulerState
  scheduledAt?: Date
  ctaLink?: string
  pinCommentText?: string
  createdAt: Date
}
