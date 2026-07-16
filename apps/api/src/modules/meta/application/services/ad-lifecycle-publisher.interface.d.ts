export interface IAdLifecycleUpdateParams {
    name?: string;
    creativeId?: string;
    trackingSpecs?: any;
}
export interface IAdLifecyclePublisher {
    updateAd(facebookAdId: string, params: IAdLifecycleUpdateParams, accessToken: string): Promise<any>;
    pauseAd(facebookAdId: string, accessToken: string): Promise<any>;
    resumeAd(facebookAdId: string, accessToken: string): Promise<any>;
    archiveAd(facebookAdId: string, accessToken: string): Promise<any>;
    duplicateAd?(facebookAdId: string, name?: string, accessToken?: string): Promise<any>;
    bulkUpdateStatus?(facebookAdIds: string[], status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED', accessToken?: string): Promise<any>;
}
