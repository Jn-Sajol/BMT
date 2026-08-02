"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function AdvancedRootPage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params?.id || "workspace-1"

  useEffect(() => {
    router.replace(`/workspace/${workspaceId}/advanced/post-scheduler`)
  }, [router, workspaceId])

  return null
}
