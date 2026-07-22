"use client"

import React from "react"

export interface ModerationLogDisplay {
  id: string
  pageId: string
  postId: string
  commentId: string
  detectedUrls: string[]
  detectionTime: string
  deleteTime?: string
  result: "Deleted" | "Allowed" | "Failed" | "Retrying"
  failureReason?: string
}

interface Props {
  totalScannedCount: number
  linkCommentsDetectedCount: number
  deletedCommentsCount: number
  failedDeletionsCount: number
  retryQueueCount: number
  processingStatus: "Active" | "Idle"
  pluginHealth: "Healthy" | "Degraded"
  history: ModerationLogDisplay[]
  onRunModeration: () => void
}

export function CommentModerationDashboard({
  totalScannedCount,
  linkCommentsDetectedCount,
  deletedCommentsCount,
  failedDeletionsCount,
  retryQueueCount,
  processingStatus,
  pluginHealth,
  history,
  onRunModeration
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Link Comment Auto Delete Engine Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement 16 | Link Comment Block & Moderation</span>
        </div>
        <button
          onClick={onRunModeration}
          style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Scan & Moderate Comments
        </button>
      </div>

      {/* Overview Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{totalScannedCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Total Scanned</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{linkCommentsDetectedCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Link Comments</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{deletedCommentsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Deleted Blocked</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>{failedDeletionsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Failed Deletions</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{retryQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Retry Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{processingStatus}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Processing Status</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Moderation History Table */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Recent Moderation Audit History</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {history.map((h) => {
          const resultColor = h.result === "Deleted" ? "#10b981" : h.result === "Allowed" ? "#3b82f6" : h.result === "Failed" ? "#ef4444" : "#f59e0b"
          return (
            <div key={h.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Comment: {h.commentId} <span style={{ fontSize: "10px", color: "#9ca3af" }}>(Page: {h.pageId} | Post: {h.postId})</span>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Detected Links: {h.detectedUrls.join(", ")}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", color: resultColor, fontWeight: "bold" }}>{h.result}</div>
                <div style={{ fontSize: "10px", color: "#9ca3af" }}>{new Date(h.detectionTime).toLocaleTimeString()}</div>
              </div>
            </div>
          )
        })}
        {history.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No moderation audit logs recorded yet.</div>
        )}
      </div>
    </div>
  )
}
