export declare class UpdateAdSetDto {
    name?: string;
    dailyBudget?: number;
    lifetimeBudget?: number;
    bidAmount?: number;
    bidStrategy?: string;
    optimizationGoal?: string;
    billingEvent?: string;
    startTime?: string;
    endTime?: string;
    targeting?: any;
}
export declare class AdSetLifecycleHistoryDto {
    id: string;
    adSetId: string;
    action: string;
    beforeStatus: string;
    afterStatus: string;
    performedBy: string;
    performedAt: string;
    metaResponse?: any;
}
