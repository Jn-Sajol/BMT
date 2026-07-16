export interface IAdCreativeLifecyclePublisher {
    updateAdCreative(facebookCreativeId: string, params: any, accessToken: string): Promise<any>;
    recreateAdCreative(params: any, accessToken: string): Promise<any>;
}
