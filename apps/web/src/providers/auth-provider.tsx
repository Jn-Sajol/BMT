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
    if (!token && !pathname.startsWith("/auth")) {
      router.push("/auth/login")
    } else if (token && pathname.startsWith("/auth")) {
      router.push("/workspaces")
    }
    setInitialized(true)
  }, [token, pathname, router])

  return (
    <AuthContext.Provider value={{ initialized }}>
      {initialized ? children : <div className="flex h-screen items-center justify-center">Loading session...</div>}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
