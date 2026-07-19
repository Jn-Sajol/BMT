import { Injectable } from "@nestjs/common"
import { MessengerCampaign, MessageHistory } from "../domain/messenger-campaign.model"

@Injectable()
export class MessengerCampaignRepository {
  private campaigns: MessengerCampaign[] = []
  private history: MessageHistory[] = []

  public async save(campaign: MessengerCampaign): Promise<MessengerCampaign> {
    const idx = this.campaigns.findIndex((c) => c.id === campaign.id)
    if (idx >= 0) {
      this.campaigns[idx] = campaign
    } else {
      this.campaigns.push(campaign)
    }
    return campaign
  }

  public async findById(id: string): Promise<MessengerCampaign | null> {
    return this.campaigns.find((c) => c.id === id) || null
  }

  public async findAll(): Promise<MessengerCampaign[]> {
    return this.campaigns
  }

  public async remove(id: string): Promise<void> {
    this.campaigns = this.campaigns.filter((c) => c.id !== id)
  }

  public async saveHistory(h: MessageHistory): Promise<MessageHistory> {
    this.history.push(h)
    return h
  }

  public async getHistory(): Promise<MessageHistory[]> {
    return this.history
  }
}
