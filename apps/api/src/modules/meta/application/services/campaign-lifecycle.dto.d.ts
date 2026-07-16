export declare class UpdateCampaignDto {
    name?: string;
    specialAdCategories?: string;
    buyingType?: string;
    dailyBudget?: number;
    lifetimeBudget?: number;
}
export declare class CampaignLifecycleHistoryDto {
    id: string;
    campaignId: string;
    action: string;
    beforeStatus: string;
    afterStatus: string;
    performedBy: string;
    performedAt: string;
    metaResponse?: any;
}
