export declare class MetaGraphClient {
    private readonly baseUrl;
    get<T = any>(endpoint: string, accessToken: string, params?: Record<string, string>): Promise<T>;
    post<T = any>(endpoint: string, accessToken: string, body: any): Promise<T>;
    pagination<T = any>(nextUrl: string): Promise<{
        data: T[];
        paging?: {
            cursors?: {
                after?: string;
                before?: string;
            };
            next?: string;
        };
    }>;
}
