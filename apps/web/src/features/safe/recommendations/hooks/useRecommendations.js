"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecommendations = useRecommendations;
const react_query_1 = require("@tanstack/react-query");
const recommendation_service_1 = require("../services/recommendation.service");
function useRecommendations() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: recommendations, isLoading } = (0, react_query_1.useQuery)({
        queryKey: ["recommendations"],
        queryFn: recommendation_service_1.RecommendationService.list,
        initialData: [],
    });
    const acceptMutation = (0, react_query_1.useMutation)({
        mutationFn: recommendation_service_1.RecommendationService.accept,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recommendations"] });
        },
    });
    const rejectMutation = (0, react_query_1.useMutation)({
        mutationFn: recommendation_service_1.RecommendationService.reject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recommendations"] });
        },
    });
    return {
        recommendations,
        isLoadingRecommendations: isLoading,
        acceptRecommendation: acceptMutation.mutateAsync,
        isAccepting: acceptMutation.isPending,
        rejectRecommendation: rejectMutation.mutateAsync,
        isRejecting: rejectMutation.isPending,
    };
}
//# sourceMappingURL=useRecommendations.js.map