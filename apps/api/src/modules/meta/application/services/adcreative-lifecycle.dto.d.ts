export declare class UpdateAdCreativeDto {
    name?: string;
    primaryText?: string;
    headline?: string;
    destinationUrl?: string;
}
export declare class AdCreativeLifecycleHistoryDto {
    id: string;
    creativeId: string;
    action: string;
    beforeStatus: string;
    afterStatus: string;
    performedBy: string;
    performedAt: string;
    metaResponse?: any;
}
