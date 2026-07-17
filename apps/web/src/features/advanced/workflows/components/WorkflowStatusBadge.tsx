"use client"

import React from "react"

interface WorkflowStatusBadgeProps {
  status: "draft" | "published" | "archived"
}

export default function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "published":
        return "bg-emerald-950 text-emerald-400 border-emerald-800"
      case "archived":
        return "bg-slate-950 text-slate-400 border-slate-800"
      default:
        return "bg-orange-950 text-orange-400 border-orange-800"
    }
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${getStyles()}`}>
      {status}
    </span>
  )
}
