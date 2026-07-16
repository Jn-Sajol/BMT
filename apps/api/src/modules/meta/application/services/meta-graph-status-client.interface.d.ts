export interface IMetaGraphStatusResponse {
    id: string;
    name: string;
    status: string;
    configured_status?: string;
    effective_status?: string;
    delivery_info?: any;
    issues_info?: any;
    review_feedback?: any;
    updated_time: string;
}
export interface IMetaGraphStatusClient {
    fetchCampaignStatus(facebookCampaignId: string, accessToken: string): Promise<IMetaGraphStatusResponse>;
    fetchAdSetStatus(facebookAdSetId: string, accessToken: string): Promise<IMetaGraphStatusResponse>;
    fetchAdStatus(facebookAdId: string, accessToken: string): Promise<IMetaGraphStatusResponse>;
}
