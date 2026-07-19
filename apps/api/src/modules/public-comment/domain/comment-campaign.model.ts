export type CampaignStatus = "Draft" | "Active" | "Paused" | "Archived"

export interface CommentCampaign {
  id: string
  title: string
  status: CampaignStatus
  country: string
  category: string
  niche: string
  keywords: string[]
  dailyLimit: number
  executionWindow: string // e.g. "09:00-18:00"
  accountTargets: string[] // target connected profiles
  createdAt: Date
  updatedAt: Date
}
export interface CommentSettings {
  maxDailyComments: number
  retryIntervalMinutes: number
}
