export interface IMetaGraphInsightsResponse {
    data: any[];
    paging?: {
        cursors?: {
            after?: string;
            before?: string;
        };
        next?: string;
    };
}
export interface IMetaGraphInsightsClient {
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
