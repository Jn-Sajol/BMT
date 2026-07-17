"use client"

import React from "react"

interface ReviewerBadgeProps {
  role: "DEVELOPER" | "REVIEWER" | "MANAGER" | "ADMIN"
}

export default function ReviewerBadge({ role }: ReviewerBadgeProps) {
  const getStyles = () => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-950 text-purple-400 border-purple-800"
      case "MANAGER":
        return "bg-blue-950 text-blue-400 border-blue-800"
      case "REVIEWER":
        return "bg-emerald-950 text-emerald-400 border-emerald-800"
      default:
        return "bg-slate-950 text-slate-400 border-slate-800"
    }
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider ${getStyles()}`}>
      {role}
    </span>
  )
}
