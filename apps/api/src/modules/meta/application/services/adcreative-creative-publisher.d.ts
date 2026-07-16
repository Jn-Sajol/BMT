import { IAdCreativeLifecyclePublisher } from './adcreative-lifecycle-publisher.interface';
export declare class AdCreativeLifecyclePublisher implements IAdCreativeLifecyclePublisher {
    private readonly baseUrl;
    updateAdCreative(facebookCreativeId: string, params: any, accessToken: string): Promise<any>;
    recreateAdCreative(params: any, accessToken: string): Promise<any>;
}
