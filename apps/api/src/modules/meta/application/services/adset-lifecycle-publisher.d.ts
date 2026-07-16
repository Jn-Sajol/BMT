import { IAdSetLifecyclePublisher, IAdSetLifecycleUpdateParams } from './adset-lifecycle-publisher.interface';
export declare class AdSetLifecyclePublisher implements IAdSetLifecyclePublisher {
    private readonly baseUrl;
    updateAdSet(facebookAdSetId: string, params: IAdSetLifecycleUpdateParams, accessToken: string): Promise<any>;
    pauseAdSet(facebookAdSetId: string, accessToken: string): Promise<any>;
    resumeAdSet(facebookAdSetId: string, accessToken: string): Promise<any>;
    archiveAdSet(facebookAdSetId: string, accessToken: string): Promise<any>;
    updateBudget(facebookAdSetId: string, dailyBudget?: number, lifetimeBudget?: number, accessToken?: string): Promise<any>;
    duplicateAdSet(facebookAdSetId: string, name?: string, accessToken?: string): Promise<any>;
    renameAdSet(facebookAdSetId: string, name: string, accessToken?: string): Promise<any>;
    schedulePause(facebookAdSetId: string, pauseTime: Date, accessToken?: string): Promise<any>;
    scheduleResume(facebookAdSetId: string, resumeTime: Date, accessToken?: string): Promise<any>;
    updateTargeting(facebookAdSetId: string, targeting: any, accessToken?: string): Promise<any>;
    private postObject;
}
