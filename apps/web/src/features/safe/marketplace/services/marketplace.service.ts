import { api } from "../../../../lib/api"

export const MarketplaceService = {
  listTemplates: async () => {
    const response = await api.get("/automation/marketplace")
    return response.data
  },
  installTemplate: async (id: string, payload: any) => {
    const response = await api.post(`/automation/marketplace/${id}/install`, payload)
    return response.data
  },
  rollbackTemplate: async (id: string) => {
    const response = await api.post(`/automation/marketplace/${id}/rollback`)
    return response.data
  },
}
