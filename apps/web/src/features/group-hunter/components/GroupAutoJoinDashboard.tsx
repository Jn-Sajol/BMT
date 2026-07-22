"use client"

import React from "react"

export interface AutoJoinTaskItem {
  id: string
  groupId: string
  groupName: string
  status: "Queued" | "Scheduled" | "Executing" | "Verified" | "Completed" | "Failed"
  scheduledTime?: string
  hbfDelayMs?: number
}

interface Props {
  tasks: AutoJoinTaskItem[]
  activeJoinsCount: number
  queuedCount: number
  scheduledCount: number
  hbfDelayStatus: string
  pluginHealth: "Healthy" | "Degraded"
  onStartAutoJoin: () => void
}

export function GroupAutoJoinDashboard({
  tasks,
  activeJoinsCount,
  queuedCount,
  scheduledCount,
  hbfDelayStatus,
  pluginHealth,
  onStartAutoJoin
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Group Auto Join Execution Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Req F-32 | Execution & Pacing Foundation</span>
        </div>
        <button
          onClick={onStartAutoJoin}
          style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Start Candidate Queue Auto Join
        </button>
      </div>

      {/* Overview Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{queuedCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Queued Candidates</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{scheduledCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Scheduled Paced Joins</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{activeJoinsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Active Pipeline Tasks</span>
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

      {/* Auto Join Pipeline Tasks List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Auto Join Pipeline Execution Tasks</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map((t) => {
          const statusColor = t.status === "Completed" ? "#10b981" : t.status === "Executing" ? "#3b82f6" : t.status === "Failed" ? "#ef4444" : "#f59e0b"
          return (
            <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  {t.groupName} <span style={{ fontSize: "10px", color: "#9ca3af" }}>({t.groupId})</span>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Status: <span style={{ color: statusColor, fontWeight: "bold" }}>{t.status}</span>
                  {t.hbfDelayMs ? ` | Pacing Delay: ${Math.round(t.hbfDelayMs / 1000)}s` : ""}
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                {t.scheduledTime ? `Scheduled: ${new Date(t.scheduledTime).toLocaleTimeString()}` : "In Pipeline"}
              </div>
            </div>
          )
        })}
        {tasks.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No candidate auto join tasks in pipeline.</div>
        )}
      </div>
    </div>
  )
}
