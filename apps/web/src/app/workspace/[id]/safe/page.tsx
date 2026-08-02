"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function SafeRootPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.id || "workspace-1"

  useEffect(() => {
    router.replace(`/workspace/${workspaceId}/safe/dashboard`)
  }, [router, workspaceId])

  return null
}
