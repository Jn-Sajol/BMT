import { CommentCampaign } from "./comment-campaign.model"

export interface IPublicCommentStrategy {
  executeCampaignRouting(campaign: CommentCampaign): Promise<{ success: boolean; commentCount: number }>
}

export class SafeCommentStrategy implements IPublicCommentStrategy {
  public async executeCampaignRouting(campaign: CommentCampaign): Promise<{ success: boolean; commentCount: number }> {
    console.log(`[SafeCommentStrategy] Routing comments manually for Campaign: ${campaign.title}...`)
    return { success: true, commentCount: 1 }
  }
}

export class AdvancedCommentAutomationStrategy implements IPublicCommentStrategy {
  public async executeCampaignRouting(campaign: CommentCampaign): Promise<{ success: boolean; commentCount: number }> {
    console.log(`[AdvancedCommentAutomationStrategy] Running background automation loops...`)
    return { success: true, commentCount: 5 }
  }
}
