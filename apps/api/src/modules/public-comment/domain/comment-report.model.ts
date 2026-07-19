export interface CommentCampaignSummaryReport {
  id: string
  campaignId: string
  campaignTitle: string
  status: string
  templateCount: number
  targetCount: number
  createdTime: Date
  updatedTime: Date
  commentsPostedCount: number
}
