"use client"

import React from "react"

export interface CommentInboxDisplayItem {
  id: string
  commentId: string
  authorName: string
  text: string
  intentCategory: string
  suggestedReplies: string[]
  status: "Incoming" | "PendingApproval" | "Approved" | "Replied" | "Failed"
}

interface Props {
  incomingCommentsCount: number
  unreadCommentsCount: number
  manualApprovalQueueCount: number
  replyQueueCount: number
  verificationQueueCount: number
  retryQueueCount: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  comments: CommentInboxDisplayItem[]
  onApproveReply: (commentId: string, replyText: string) => void
}

export function CommentReplyDashboard({
  incomingCommentsCount,
  unreadCommentsCount,
  manualApprovalQueueCount,
  replyQueueCount,
  verificationQueueCount,
  retryQueueCount,
  pluginHealth,
  frameworkStatus,
  comments,
  onApproveReply
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>AI Reply Comment Assistant Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #11 | Local Rule-Based Reply Foundation</span>
        </div>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
          Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{incomingCommentsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Incoming Comments</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{unreadCommentsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Unread Comments</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{manualApprovalQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Manual Approval Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{replyQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Reply Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{verificationQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Verification Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>{retryQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Retry Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Suggested Replies & Manual Approval List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Suggested Replies & Approval Inbox</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {comments.map((c) => (
          <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                {c.authorName} <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>Intent: {c.intentCategory}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "bold" }}>{c.status}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>"{c.text}"</div>
            
            {/* Suggested Replies List */}
            <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px", borderRadius: "4px" }}>
              <div style={{ fontSize: "11px", color: "#10b981", marginBottom: "4px", fontWeight: "bold" }}>Suggested Variations:</div>
              {c.suggestedReplies.map((sr, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", marginTop: "4px", background: "rgba(255,255,255,0.02)", padding: "4px 8px", borderRadius: "4px" }}>
                  <span>{sr}</span>
                  <button
                    onClick={() => onApproveReply(c.commentId, sr)}
                    style={{ background: "#10b981", border: "none", color: "#fff", padding: "2px 8px", borderRadius: "3px", cursor: "pointer", fontSize: "10px" }}
                  >
                    Approve Reply
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No comments awaiting reply approval.</div>
        )}
      </div>
    </div>
  )
}
