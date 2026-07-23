import { Injectable } from "@nestjs/common"

export interface PreparedCampaignQueueItem {
  campaignId: string
  groupId: string
  workspaceId: string
  accountId: string
  status: "PREPARED" | "PENDING"
  preparedAt: Date
  payload: Record<string, any>
}

@Injectable()
export class MessengerGroupCampaignPreparationService {
  private campaignQueueStore: Map<string, PreparedCampaignQueueItem> = new Map()

  public prepareCampaignQueueItem(payload: {
    groupId: string
    workspaceId: string
    accountId: string
    campaignDetails?: Record<string, any>
  }): PreparedCampaignQueueItem {
    if (!payload.groupId || !payload.workspaceId || !payload.accountId) {
      throw new Error("Invalid payload: missing groupId, workspaceId, or accountId")
    }

    const campaignId = `gcamp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const item: PreparedCampaignQueueItem = {
      campaignId,
      groupId: payload.groupId,
      workspaceId: payload.workspaceId,
      accountId: payload.accountId,
      status: "PREPARED",
      preparedAt: new Date(),
      payload: payload.campaignDetails || {}
    }

    this.campaignQueueStore.set(campaignId, item)
    return item
  }

  public getPreparedCampaign(campaignId: string): PreparedCampaignQueueItem | null {
    return this.campaignQueueStore.get(campaignId) || null
  }

  public getAllPreparedCampaigns(): PreparedCampaignQueueItem[] {
    return Array.from(this.campaignQueueStore.values())
  }
}
