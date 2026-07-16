import { api } from "../../../../lib/api"

export const DashboardService = {
  getKPIs: async () => {
    // In SAFE Mode, this queries aggregate campaign metrics
    const response = await api.get("/automation/recommendations/dashboard")
    return response.data
  },
  getRecentActivities: async () => {
    const response = await api.get("/audit-logs")
    return response.data
  },
}
