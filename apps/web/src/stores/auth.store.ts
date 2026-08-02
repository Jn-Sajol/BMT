import { create } from "zustand"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  setSession: (token: string, refreshToken: string, user: User) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" && localStorage.getItem("bmt_token") && localStorage.getItem("bmt_token") !== "undefined" && localStorage.getItem("bmt_token") !== "null"
    ? localStorage.getItem("bmt_token")
    : null,
  refreshToken: typeof window !== "undefined" && localStorage.getItem("bmt_refresh_token") && localStorage.getItem("bmt_refresh_token") !== "undefined" && localStorage.getItem("bmt_refresh_token") !== "null"
    ? localStorage.getItem("bmt_refresh_token")
    : null,
  user: typeof window !== "undefined" && localStorage.getItem("bmt_user") && localStorage.getItem("bmt_user") !== "undefined"
    ? (() => {
        try {
          return JSON.parse(localStorage.getItem("bmt_user")!)
        } catch {
          return null
        }
      })()
    : null,
  setSession: (token, refreshToken, user) => {
    localStorage.setItem("bmt_token", token)
    localStorage.setItem("bmt_refresh_token", refreshToken)
    localStorage.setItem("bmt_user", JSON.stringify(user))
    if (typeof document !== "undefined") {
      document.cookie = `bmt_token=${token}; path=/; max-age=604800; SameSite=Lax`
    }
    set({ token, refreshToken, user })
  },
  clearSession: () => {
    localStorage.removeItem("bmt_token")
    localStorage.removeItem("bmt_refresh_token")
    localStorage.removeItem("bmt_user")
    if (typeof document !== "undefined") {
      document.cookie = "bmt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    }
    set({ token: null, refreshToken: null, user: null })
  },
}))
