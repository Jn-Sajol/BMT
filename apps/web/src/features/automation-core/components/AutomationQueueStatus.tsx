"use client"

import React from "react"

export interface QueueCountItem {
  queueName: string
  pendingCount: number
  activeCount: number
}

interface Props {
  queues: QueueCountItem[]
}

export function AutomationQueueStatus({ queues }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>BullMQ Pipeline Queues Overview</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
        {queues.map((q) => (
          <div key={q.queueName} style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase" }}>{q.queueName}</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "4px" }}>{q.pendingCount}</div>
            <span style={{ fontSize: "10px", color: "#10b981" }}>{q.activeCount} active</span>
          </div>
        ))}
      </div>
    </div>
  )
}
