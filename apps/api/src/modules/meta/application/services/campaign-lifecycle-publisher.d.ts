import { ICampaignLifecyclePublisher, ICampaignLifecycleUpdateParams } from './campaign-lifecycle-publisher.interface';
export declare class CampaignLifecyclePublisher implements ICampaignLifecyclePublisher {
    private readonly baseUrl;
    updateCampaign(facebookCampaignId: string, params: ICampaignLifecycleUpdateParams, accessToken: string): Promise<any>;
    pauseCampaign(facebookCampaignId: string, accessToken: string): Promise<any>;
    resumeCampaign(facebookCampaignId: string, accessToken: string): Promise<any>;
    archiveCampaign(facebookCampaignId: string, accessToken: string): Promise<any>;
    updateBudget(facebookCampaignId: string, dailyBudget?: number, lifetimeBudget?: number, accessToken?: string): Promise<any>;
    duplicateCampaign(facebookCampaignId: string, name?: string, accessToken?: string): Promise<any>;
    renameCampaign(facebookCampaignId: string, name: string, accessToken?: string): Promise<any>;
    schedulePause(facebookCampaignId: string, pauseTime: Date, accessToken?: string): Promise<any>;
    scheduleResume(facebookCampaignId: string, resumeTime: Date, accessToken?: string): Promise<any>;
    private postObject;
}
