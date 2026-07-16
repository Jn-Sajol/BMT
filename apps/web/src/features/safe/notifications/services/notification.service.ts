import { api } from "../../../../lib/api"

export const NotificationService = {
  list: async () => {
    const response = await api.get("/notifications")
    return response.data
  },
  updateSettings: async (payload: any) => {
    const response = await api.put("/notifications/config", payload)
    return response.data
  },
}
