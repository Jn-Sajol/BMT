export interface CampaignReport {
  id: string
  campaignId: string
  campaignTitle: string
  groupsCount: number
  deliveryCount: number
  failureCount: number
  sentTime?: Date
  status: string
}
