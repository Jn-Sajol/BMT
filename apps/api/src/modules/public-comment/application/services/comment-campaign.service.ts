import { Injectable, NotFoundException } from "@nestjs/common"
import { CommentCampaignRepository } from "../../infrastructure/comment-campaign.repository"
import { CommentCampaign, CampaignStatus } from "../../domain/comment-campaign.model"

@Injectable()
export class CommentCampaignService {
  constructor(private readonly commentCampaignRepository: CommentCampaignRepository) {}

  public async getCampaigns(): Promise<CommentCampaign[]> {
    return this.commentCampaignRepository.findAll()
  }

  public async createCampaign(
    title: string,
    country: string,
    category: string,
    niche: string,
    keywords: string[],
    dailyLimit: number,
    executionWindow: string,
    accountTargets: string[]
  ): Promise<CommentCampaign> {
    const campaign: CommentCampaign = {
      id: `ccamp-${Date.now()}`,
      title,
      status: "Draft",
      country,
      category,
      niche,
      keywords,
      dailyLimit,
      executionWindow,
      accountTargets,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.commentCampaignRepository.save(campaign)
  }

  public async getCampaignById(id: string): Promise<CommentCampaign> {
    const campaign = await this.commentCampaignRepository.findById(id)
    if (!campaign) {
      throw new NotFoundException("Comment Campaign not found.")
    }
    return campaign
  }

  public async updateCampaign(id: string, updates: Partial<CommentCampaign>): Promise<CommentCampaign> {
    const campaign = await this.getCampaignById(id)
    Object.assign(campaign, updates)
    campaign.updatedAt = new Date()
    return this.commentCampaignRepository.save(campaign)
  }

  public async deleteCampaign(id: string): Promise<void> {
    await this.commentCampaignRepository.remove(id)
  }

  public async duplicateCampaign(id: string): Promise<CommentCampaign> {
    const original = await this.getCampaignById(id)
    const duplicate: CommentCampaign = {
      ...original,
      id: `ccamp-${Date.now()}-dup`,
      title: `${original.title} (Copy)`,
      status: "Draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.commentCampaignRepository.save(duplicate)
  }
}
