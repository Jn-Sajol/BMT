import axios from "axios"
import { useAuthStore } from "../stores/auth.store"
import { useWorkspaceStore } from "../stores/workspace.store"
import { env } from "./env"

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
})

// Request Interceptor: Inject JWT and Workspace Headers
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  const activeWorkspace = useWorkspaceStore.getState().activeWorkspace

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (activeWorkspace) {
    config.headers["x-workspace-id"] = activeWorkspace.id
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response Interceptor: Manage 401 Session Refresh
api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const refreshToken = useAuthStore.getState().refreshToken

    if (refreshToken) {
      try {
        const response = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken })
        const { token, newRefreshToken, user } = response.data
        useAuthStore.getState().setSession(token, newRefreshToken, user)
        
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearSession()
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login"
        }
      }
    }
  }
  return Promise.reject(error)
})
