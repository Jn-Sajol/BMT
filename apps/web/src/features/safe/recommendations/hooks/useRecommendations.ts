import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RecommendationService } from "../services/recommendation.service"

export function useRecommendations() {
  const queryClient = useQueryClient()

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: RecommendationService.list,
    initialData: [],
  })

  const acceptMutation = useMutation({
    mutationFn: RecommendationService.accept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: RecommendationService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] })
    },
  })

  return {
    recommendations,
    isLoadingRecommendations: isLoading,
    acceptRecommendation: acceptMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,
    rejectRecommendation: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
  }
}
