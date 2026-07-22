"use client"

import React from "react"

export interface CollectionTaskDisplay {
  id: string
  targetId: string
  normalizedUrl: string
  status: "Queued" | "CollectionQueueEnqueued" | "Verified" | "Reported" | "Completed" | "Failed"
  collectedBatchesCount: number
  collectedCommentsCount: number
}

interface Props {
  tasks: CollectionTaskDisplay[]
  queuedTargetsCount: number
  collectionQueueCount: number
  verificationQueueCount: number
  retryQueueCount: number
  hbfDelayStatus: string
  pluginHealth: "Healthy" | "Degraded"
  workerStatus: "Active" | "Idle"
  onStartCollection: () => void
}

export function CommentCollectionDashboard({
  tasks,
  queuedTargetsCount,
  collectionQueueCount,
  verificationQueueCount,
  retryQueueCount,
  hbfDelayStatus,
  pluginHealth,
  workerStatus,
  onStartCollection
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Comment Collection Orchestration Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Req F-31 | Collection Orchestration Layer</span>
        </div>
        <button
          onClick={onStartCollection}
          style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Start Comment Collection
        </button>
      </div>

      {/* Metrics & Queue Overview Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{queuedTargetsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Queued Targets</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{collectionQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Collection Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{verificationQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Verification Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{retryQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Retry Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{hbfDelayStatus}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>HBF Delay</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{workerStatus}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Worker Status</span>
        </div>
      </div>

      {/* Collection Tasks Pipeline Table */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Collection Pipeline Tasks</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map((t) => {
          const statusColor = t.status === "Completed" ? "#10b981" : t.status === "CollectionQueueEnqueued" ? "#3b82f6" : t.status === "Failed" ? "#ef4444" : "#f59e0b"
          return (
            <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Target: {t.targetId}
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  {t.normalizedUrl}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: statusColor, fontWeight: "bold" }}>{t.status}</div>
                <div style={{ fontSize: "10px", color: "#9ca3af" }}>Batches: {t.collectedBatchesCount} | Comments: {t.collectedCommentsCount}</div>
              </div>
            </div>
          )
        })}
        {tasks.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No collection tasks in pipeline.</div>
        )}
      </div>
    </div>
  )
}
