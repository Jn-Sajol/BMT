"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WorkspaceRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/workspace/workspace-1/safe/dashboard")
  }, [router])

  return null
}
