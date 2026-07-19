import { Injectable, NotFoundException } from "@nestjs/common"
import { MessengerCampaignRepository } from "../../infrastructure/messenger-campaign.repository"
import { MessengerCampaign, MessageHistory } from "../../domain/messenger-campaign.model"

@Injectable()
export class MessengerCampaignBuilderService {
  constructor(private readonly messengerCampaignRepository: MessengerCampaignRepository) {}

  public async createCampaign(title: string, groupIds: string[], templateId: string): Promise<MessengerCampaign> {
    const campaign: MessengerCampaign = {
      id: `mcamp-${Date.now()}`,
      title,
      groupIds,
      templateId,
      status: "Draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.messengerCampaignRepository.save(campaign)
  }

  public async getCampaignById(id: string): Promise<MessengerCampaign> {
    const campaign = await this.messengerCampaignRepository.findById(id)
    if (!campaign) {
      throw new NotFoundException("Messenger group campaign not found.")
    }
    return campaign
  }

  public async updateCampaign(id: string, updates: Partial<MessengerCampaign>): Promise<MessengerCampaign> {
    const campaign = await this.getCampaignById(id)
    Object.assign(campaign, updates)
    campaign.updatedAt = new Date()
    return this.messengerCampaignRepository.save(campaign)
  }

  public async deleteCampaign(id: string): Promise<void> {
    await this.messengerCampaignRepository.remove(id)
  }

  public async scheduleCampaign(id: string, scheduledAt: Date): Promise<MessengerCampaign> {
    const campaign = await this.getCampaignById(id)
    campaign.status = "Scheduled"
    campaign.scheduledAt = scheduledAt
    return this.messengerCampaignRepository.save(campaign)
  }

  public async cancelSchedule(id: string): Promise<MessengerCampaign> {
    const campaign = await this.getCampaignById(id)
    campaign.status = "Cancelled"
    return this.messengerCampaignRepository.save(campaign)
  }

  public async executeManualSend(id: string, user: string): Promise<MessageHistory> {
    const campaign = await this.getCampaignById(id)
    campaign.status = "Sent"
    await this.messengerCampaignRepository.save(campaign)

    const history: MessageHistory = {
      id: `mhis-${Date.now()}`,
      campaignId: id,
      groupIds: campaign.groupIds,
      user,
      sentTime: new Date(),
      status: "success",
    }
    return this.messengerCampaignRepository.saveHistory(history)
  }

  public async getHistory(): Promise<MessageHistory[]> {
    return this.messengerCampaignRepository.getHistory()
  }

  public async getCampaigns(): Promise<MessengerCampaign[]> {
    return this.messengerCampaignRepository.findAll()
  }
}
