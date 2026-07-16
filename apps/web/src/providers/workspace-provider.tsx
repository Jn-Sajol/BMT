"use client"

import React, { useEffect } from "react"
import { useWorkspaceStore } from "../stores/workspace.store"
import { useRouter, usePathname } from "next/navigation"

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { activeWorkspace, activeMode } = useWorkspaceStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Block access to layout directories if no workspace is active
    if (!pathname.startsWith("/auth") && pathname !== "/workspaces") {
      if (!activeWorkspace || !activeMode) {
        router.push("/workspaces")
      }
    }
  }, [activeWorkspace, activeMode, pathname, router])

  return <>{children}</>
}
