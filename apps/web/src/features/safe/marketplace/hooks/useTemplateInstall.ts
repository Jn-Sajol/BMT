import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MarketplaceService } from "../services/marketplace.service"

export function useTemplateInstall() {
  const queryClient = useQueryClient()

  const installMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      MarketplaceService.installTemplate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-templates"] })
    },
  })

  const rollbackMutation = useMutation({
    mutationFn: (id: string) => MarketplaceService.rollbackTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-templates"] })
    },
  })

  return {
    installTemplate: installMutation.mutateAsync,
    isInstalling: installMutation.isPending,
    rollbackTemplate: rollbackMutation.mutateAsync,
    isRollingBack: rollbackMutation.isPending,
  }
}
