export declare function useRecommendations(): {
    recommendations: any;
    isLoadingRecommendations: false;
    acceptRecommendation: import("@tanstack/react-query").UseMutateAsyncFunction<any, Error, string, unknown>;
    isAccepting: boolean;
    rejectRecommendation: import("@tanstack/react-query").UseMutateAsyncFunction<any, Error, string, unknown>;
    isRejecting: boolean;
};
