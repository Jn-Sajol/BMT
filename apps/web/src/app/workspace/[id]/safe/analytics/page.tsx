"use client"

import React from "react"
import { useWorkspace } from "../../../../../hooks/useWorkspace"

export default function SafeAnalyticsPage() {
  const { activeWorkspace } = useWorkspace()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Analytics</h1>
        <p className="text-muted-foreground">Historical conversion metrics and performance charts</p>
      </div>

      <div className="border bg-card rounded-xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Traffic & Conversion Performance</h3>
        <div className="h-64 flex items-center justify-center bg-muted/20 border border-dashed rounded-lg">
          <span className="text-sm text-muted-foreground">Performance Chart Visualization (SAFE View)</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border bg-card p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold text-sm text-muted-foreground">Active Campaigns</h4>
          <div className="text-2xl font-bold mt-2">18</div>
        </div>
        <div className="border bg-card p-6 rounded-xl shadow-sm">
          <h4 className="font-semibold text-sm text-muted-foreground">Workspace Scope</h4>
          <div className="text-2xl font-bold mt-2">{activeWorkspace?.name || "Corporate"}</div>
        </div>
      </div>
    </div>
  )
}
