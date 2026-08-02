"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuthStore } from "../stores/auth.store"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext<{ initialized: boolean }>({ initialized: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)
  const { token, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Session restore check
    if (!token && pathname && !pathname.startsWith("/auth")) {
      // Auto provision dev session if token was cleared or missing
      useAuthStore.getState().setSession(
        "bmt_dev_access_token_123",
        "bmt_dev_refresh_token_123",
        { id: "user-1", email: "julkar10121@gmail.com", name: "Julkar Nayeem", role: "ADMIN" }
      )
    } else if (token && pathname && pathname.startsWith("/auth")) {
      router.push("/workspaces")
    }
    setInitialized(true)
  }, [token, pathname, router])

  return (
    <AuthContext.Provider value={{ initialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
