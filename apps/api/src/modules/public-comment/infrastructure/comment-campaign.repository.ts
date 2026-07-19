import { Injectable } from "@nestjs/common"
import { CommentCampaign } from "../domain/comment-campaign.model"

@Injectable()
export class CommentCampaignRepository {
  private campaigns: CommentCampaign[] = []

  public async save(campaign: CommentCampaign): Promise<CommentCampaign> {
    const idx = this.campaigns.findIndex((c) => c.id === campaign.id)
    if (idx >= 0) {
      this.campaigns[idx] = campaign
    } else {
      this.campaigns.push(campaign)
    }
    return campaign
  }

  public async findById(id: string): Promise<CommentCampaign | null> {
    return this.campaigns.find((c) => c.id === id) || null
  }

  public async findAll(): Promise<CommentCampaign[]> {
    return this.campaigns
  }

  public async remove(id: string): Promise<void> {
    this.campaigns = this.campaigns.filter((c) => c.id !== id)
  }
}
