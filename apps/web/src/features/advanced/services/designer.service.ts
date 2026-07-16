import { api } from "../../../lib/api"

export const AdvancedDesignerService = {
  listWorkflows: async () => {
    const response = await api.get("/automation/workflows")
    return response.data
  },
  getWorkflow: async (id: string) => {
    const response = await api.get(`/automation/workflows/${id}`)
    return response.data
  },
  compileWorkflow: async (id: string, payload: any) => {
    const response = await api.post(`/automation/workflows/${id}/compile`, payload)
    return response.data
  },
  validateWorkflow: async (id: string, payload: any) => {
    const response = await api.post(`/automation/workflows/${id}/validate`, payload)
    return response.data
  },
  publishWorkflow: async (id: string, payload: any) => {
    const response = await api.post(`/automation/workflows/${id}/publish`, payload)
    return response.data
  },
  deployWorkflow: async (id: string, payload: any) => {
    const response = await api.post(`/automation/workflows/${id}/deploy`, payload)
    return response.data
  },
  listExecutions: async () => {
    const response = await api.get("/automation/executions")
    return response.data
  },
  getExecutionLogs: async (id: string) => {
    const response = await api.get(`/automation/executions/${id}/logs`)
    return response.data
  },
  listVariables: async () => {
    const response = await api.get("/automation/variables")
    return response.data
  },
  listTriggers: async () => {
    const response = await api.get("/automation/triggers")
    return response.data
  },
}
