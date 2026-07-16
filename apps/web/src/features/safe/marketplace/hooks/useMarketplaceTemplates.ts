import { useQuery } from "@tanstack/react-query"
import { MarketplaceService } from "../services/marketplace.service"

export function useMarketplaceTemplates() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["marketplace-templates"],
    queryFn: MarketplaceService.listTemplates,
    initialData: [],
  })

  return {
    templates,
    isLoadingTemplates: isLoading,
  }
}
