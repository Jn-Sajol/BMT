import { api } from "../lib/api"

export const AuthService = {
  login: async (payload: any) => {
    const response = await api.post("/auth/login", payload)
    return response.data
  },
  register: async (payload: any) => {
    const response = await api.post("/auth/register", payload)
    return response.data
  },
  forgotPassword: async (payload: any) => {
    const response = await api.post("/auth/forgot-password", payload)
    return response.data
  },
  resetPassword: async (payload: any) => {
    const response = await api.post("/auth/reset-password", payload)
    return response.data
  },
  verifyEmail: async (payload: any) => {
    const response = await api.post("/auth/verify-email", payload)
    return response.data
  },
}
