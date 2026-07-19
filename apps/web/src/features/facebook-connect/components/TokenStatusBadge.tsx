"use client"

import React from "react"

interface Props {
  valid: boolean
  expiresSeconds: number
}

export function TokenStatusBadge({ valid, expiresSeconds }: Props) {
  const formatTime = (sec: number) => {
    const days = Math.floor(sec / (3600 * 24))
    if (days > 0) return `${days}d remaining`
    const hrs = Math.floor(sec / 3600)
    return `${hrs}h remaining`
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "sans-serif" }}>
      <span style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: valid ? "#10b981" : "#ef4444"
      }} />
      <span style={{ fontSize: "13px", color: valid ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
        {valid ? `Token Active (${formatTime(expiresSeconds)})` : "Token Expired / Disconnected"}
      </span>
    </div>
  )
}
