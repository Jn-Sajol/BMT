import { IAdLifecyclePublisher, IAdLifecycleUpdateParams } from './ad-lifecycle-publisher.interface';
export declare class AdLifecyclePublisher implements IAdLifecyclePublisher {
    private readonly baseUrl;
    updateAd(facebookAdId: string, params: IAdLifecycleUpdateParams, accessToken: string): Promise<any>;
    pauseAd(facebookAdId: string, accessToken: string): Promise<any>;
    resumeAd(facebookAdId: string, accessToken: string): Promise<any>;
    archiveAd(facebookAdId: string, accessToken: string): Promise<any>;
    duplicateAd(facebookAdId: string, name?: string, accessToken?: string): Promise<any>;
    bulkUpdateStatus(facebookAdIds: string[], status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED', accessToken?: string): Promise<any>;
    private postObject;
}
