"use client"

import React from "react"

export interface CandidateGroupDisplay {
  id: string
  name: string
  memberCount: number
  category: string
  relevanceScore: number
  priorityScore: number
  privacy: string
  isDuplicate: boolean
}

interface Props {
  candidates: CandidateGroupDisplay[]
  discoveryStatus: "Idle" | "Searching" | "Scoring" | "Completed"
  hbfStatus: string
  pluginHealth: "Healthy" | "Degraded"
  onStartDiscovery: () => void
}

export function GroupHunterDashboard({ candidates, discoveryStatus, hbfStatus, pluginHealth, onStartDiscovery }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Group Hunter Discovery Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Req F-32 | Discovery & Intelligence Foundation</span>
        </div>
        <button
          onClick={onStartDiscovery}
          style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Start Group Discovery
        </button>
      </div>

      {/* Overview Metric Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{candidates.length}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Discovered Candidates</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{discoveryStatus}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Discovery Progress</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{hbfStatus}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>HBF Pacing Delay</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Discovered Candidate Groups Table */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Discovered Candidate Groups Queue</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {candidates.map((g) => (
          <div key={g.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                {g.name} <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{g.privacy}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                Members: {g.memberCount.toLocaleString()} | Category: <span style={{ color: "#60a5fa" }}>{g.category}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold" }}>Priority Score: {g.priorityScore}/100</div>
              <div style={{ fontSize: "10px", color: "#9ca3af" }}>AI Relevance: {g.relevanceScore}%</div>
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No candidate groups discovered yet. Click &quot;Start Group Discovery&quot; above.</div>
        )}
      </div>
    </div>
  )
}
