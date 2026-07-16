import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { NotificationService } from "../services/notification.service"

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationService.list,
    initialData: [],
  })

  const updateConfigMutation = useMutation({
    mutationFn: NotificationService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  return {
    notifications,
    isLoadingNotifications: isLoading,
    updateSettings: updateConfigMutation.mutateAsync,
    isUpdatingSettings: updateConfigMutation.isPending,
  }
}
