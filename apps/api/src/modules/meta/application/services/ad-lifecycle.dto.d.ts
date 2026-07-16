export declare class UpdateAdDto {
    name?: string;
    creativeId?: string;
    trackingSpecs?: any;
}
export declare class AdLifecycleHistoryDto {
    id: string;
    adId: string;
    action: string;
    beforeStatus: string;
    afterStatus: string;
    performedBy: string;
    performedAt: string;
    metaResponse?: any;
}
