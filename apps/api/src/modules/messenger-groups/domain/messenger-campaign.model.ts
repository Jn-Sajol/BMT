export type CampaignStatus = "Draft" | "Scheduled" | "Sent" | "Cancelled"

export interface MessengerCampaign {
  id: string
  title: string
  groupIds: string[]
  templateId: string
  status: CampaignStatus
  scheduledAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface MessengerSchedule {
  id: string
  campaignId: string
  scheduledAt: Date
  status: "Pending" | "Queued" | "Executed" | "Cancelled"
}

export interface MessageTemplate {
  id: string
  content: string
  category: string
  tags: string[]
  language: string
}

export interface MessageHistory {
  id: string
  campaignId: string
  groupIds: string[]
  user: string
  sentTime: Date
  status: "success" | "failed"
}

export interface CampaignSettings {
  maxDailyGroupMessages: number
}
