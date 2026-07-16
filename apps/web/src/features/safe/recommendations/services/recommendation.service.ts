import { api } from "../../../../lib/api"

export const RecommendationService = {
  list: async () => {
    const response = await api.get("/automation/recommendations")
    return response.data
  },
  accept: async (id: string) => {
    const response = await api.post(`/automation/recommendations/${id}/accept`)
    return response.data
  },
  reject: async (id: string) => {
    const response = await api.post(`/automation/recommendations/${id}/reject`)
    return response.data
  },
}
