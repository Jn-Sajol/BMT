"use client"

import React from "react"

export interface CommentTargetDisplay {
  id: string
  targetId: string
  normalizedUrl: string
  classification: string
  status: "Registered" | "Queued" | "Parsing" | "Verified" | "Completed" | "Failed"
  parsedAt?: string
}

interface Props {
  targets: CommentTargetDisplay[]
  parsingQueueCount: number
  scheduledCount: number
  hbfDelayStatus: string
  pluginHealth: "Healthy" | "Degraded"
  onRegisterTarget: () => void
}

export function CommentBlockDashboard({
  targets,
  parsingQueueCount,
  scheduledCount,
  hbfDelayStatus,
  pluginHealth,
  onRegisterTarget
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Comment Block Scraper Foundation Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Req F-31 | Orchestration & Parsing Foundation</span>
        </div>
        <button
          onClick={onRegisterTarget}
          style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Register Target URL
        </button>
      </div>

      {/* Metric Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{targets.length}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Registered Targets</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{parsingQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Parsing Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{scheduledCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Scheduled Paced Tasks</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{hbfDelayStatus}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>HBF Pacing Status</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Registered Comment Targets Table */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Registered Comment Targets Pipeline</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {targets.map((t) => {
          const statusColor = t.status === "Completed" ? "#10b981" : t.status === "Parsing" ? "#3b82f6" : t.status === "Failed" ? "#ef4444" : "#f59e0b"
          return (
            <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Target: {t.targetId} <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{t.classification}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "450px" }}>
                  {t.normalizedUrl}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: statusColor, fontWeight: "bold" }}>{t.status}</div>
                {t.parsedAt && <div style={{ fontSize: "10px", color: "#9ca3af" }}>{new Date(t.parsedAt).toLocaleTimeString()}</div>}
              </div>
            </div>
          )
        })}
        {targets.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No comment targets registered in pipeline.</div>
        )}
      </div>
    </div>
  )
}
