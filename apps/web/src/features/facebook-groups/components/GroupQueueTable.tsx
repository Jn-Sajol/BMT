"use client"

import React from "react"

interface QueueItem {
  id: string
  postId: string
  groupIds: string[]
  status: "Pending" | "Queued" | "Running" | "Completed" | "Failed" | "Retrying" | "Cancelled"
  scheduledAt: string
}

interface Props {
  queue: QueueItem[]
}

export function GroupQueueTable({ queue }: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px" }}>
      <h4 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>Group Publishing Queue Status</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Post ID</th>
            <th style={{ padding: "8px" }}>Groups Count</th>
            <th style={{ padding: "8px" }}>Scheduled Time</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{item.postId}</td>
              <td style={{ padding: "8px" }}>{item.groupIds.length}</td>
              <td style={{ padding: "8px" }}>{new Date(item.scheduledAt).toLocaleString()}</td>
              <td style={{ padding: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: item.status === "Completed" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                  color: item.status === "Completed" ? "#10b981" : "#f59e0b"
                }}>{item.status}</span>
              </td>
            </tr>
          ))}
          {queue.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "8px", textAlign: "center", color: "#9ca3af" }}>Queue is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
