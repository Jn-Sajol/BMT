"use client"

import React from "react"
import { useWorkspace } from "../../../../../hooks/useWorkspace"

export default function AdvancedDesigner() {
  const { activeWorkspace } = useWorkspace()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Workflow Designer</h1>
        <p className="text-muted-foreground">Orchestrate triggers, conditions, and automated actions</p>
      </div>

      <div className="border border-dashed border-orange-500/30 bg-card rounded-xl p-12 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
          ⚙️
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Interactive Canvas Workspace</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Design topologically compiled automation flows inside {activeWorkspace?.name || "Corporate Workspace"}.
          </p>
        </div>
      </div>
    </div>
  )
}
