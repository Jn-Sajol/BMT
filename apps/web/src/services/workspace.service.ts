import { api } from "../lib/api"

export const WorkspaceService = {
  list: async () => {
    const response = await api.get("/workspaces")
    return response.data
  },
  create: async (payload: any) => {
    const response = await api.post("/workspaces", payload)
    return response.data
  },
}
