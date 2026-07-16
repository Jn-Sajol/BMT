import { IMetaGraphStatusClient, IMetaGraphStatusResponse } from './meta-graph-status-client.interface';
export declare class MetaGraphStatusClient implements IMetaGraphStatusClient {
    private readonly baseUrl;
    private readonly fields;
    fetchCampaignStatus(facebookCampaignId: string, accessToken: string): Promise<IMetaGraphStatusResponse>;
    fetchAdSetStatus(facebookAdSetId: string, accessToken: string): Promise<IMetaGraphStatusResponse>;
    fetchAdStatus(facebookAdId: string, accessToken: string): Promise<IMetaGraphStatusResponse>;
    private fetchObject;
}
