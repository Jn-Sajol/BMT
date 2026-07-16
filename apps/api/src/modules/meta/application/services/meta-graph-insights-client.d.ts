import { IMetaGraphInsightsClient, IMetaGraphInsightsResponse } from './meta-graph-insights-client.interface';
export declare class MetaGraphInsightsClient implements IMetaGraphInsightsClient {
    private readonly baseUrl;
    fetchInsights(facebookObjectId: string, accessToken: string, fields: string[], params: {
        date_preset?: string;
        time_range?: {
            since: string;
            until: string;
        };
        time_increment?: string | number;
        limit?: number;
        after?: string;
    }): Promise<IMetaGraphInsightsResponse>;
}
