export interface ICampaignLifecycleUpdateParams {
  name?: string;
  specialAdCategories?: string;
  buyingType?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
}

export interface ICampaignLifecyclePublisher {
  updateCampaign(facebookCampaignId: string, params: ICampaignLifecycleUpdateParams, accessToken: string): Promise<any>;
  pauseCampaign(facebookCampaignId: string, accessToken: string): Promise<any>;
  resumeCampaign(facebookCampaignId: string, accessToken: string): Promise<any>;
  archiveCampaign(facebookCampaignId: string, accessToken: string): Promise<any>;

  updateBudget?(facebookCampaignId: string, dailyBudget?: number, lifetimeBudget?: number, accessToken?: string): Promise<any>;
  duplicateCampaign?(facebookCampaignId: string, name?: string, accessToken?: string): Promise<any>;
  renameCampaign?(facebookCampaignId: string, name: string, accessToken?: string): Promise<any>;
  schedulePause?(facebookCampaignId: string, pauseTime: Date, accessToken?: string): Promise<any>;
  scheduleResume?(facebookCampaignId: string, resumeTime: Date, accessToken?: string): Promise<any>;
}
