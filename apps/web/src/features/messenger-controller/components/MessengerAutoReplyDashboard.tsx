"use client"

import React from "react"

export interface AutoReplyRunningConversation {
  id: string
  conversationId: string
  pageId: string
  senderName: string
  lastMessageText: string
  generatedReply: string
  replyMode: "Sales Conversion" | "Lead Conversion" | "Visit Conversion"
  delaySeconds: number
  isFallback: boolean
  processedAt: string
}

interface Props {
  isAutoReplyEnabled: boolean
  runningConversationsCount: number
  delayQueueCount: number
  verificationQueueCount: number
  retryQueueCount: number
  dailyReplyCount: number
  maxDailyLimit: number
  currentReplyMode: "Sales Conversion" | "Lead Conversion" | "Visit Conversion"
  policyViolationsCount: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  runningConversations: AutoReplyRunningConversation[]
  onToggleAutoReply: () => void
  onChangeReplyMode: (mode: "Sales Conversion" | "Lead Conversion" | "Visit Conversion") => void
}

export function MessengerAutoReplyDashboard({
  isAutoReplyEnabled,
  runningConversationsCount,
  delayQueueCount,
  verificationQueueCount,
  retryQueueCount,
  dailyReplyCount,
  maxDailyLimit,
  currentReplyMode,
  policyViolationsCount,
  pluginHealth,
  frameworkStatus,
  runningConversations,
  onToggleAutoReply,
  onChangeReplyMode
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Messenger Auto Reply Engine Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #12 Completion | Automated Reply & Pacing Pipeline</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={onToggleAutoReply}
            style={{
              background: isAutoReplyEnabled ? "#10b981" : "#ef4444",
              border: "none",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px"
            }}
          >
            Auto Reply: {isAutoReplyEnabled ? "ENABLED" : "DISABLED"}
          </button>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{runningConversationsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Running Conversations</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{delayQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Delay Queue (30s-3m)</span>
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
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{dailyReplyCount} / {maxDailyLimit}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Daily Replies Sent</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: policyViolationsCount > 0 ? "#ef4444" : "#10b981" }}>{policyViolationsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Policy Violations</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Reply Mode Configurator */}
      <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px", marginBottom: "16px" }}>
        <h4 style={{ color: "#10b981", margin: "0 0 8px 0", fontSize: "13px" }}>Active Conversation Reply Mode</h4>
        <div style={{ display: "flex", gap: "12px" }}>
          {(["Sales Conversion", "Lead Conversion", "Visit Conversion"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onChangeReplyMode(mode)}
              style={{
                background: currentReplyMode === mode ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.04)",
                border: currentReplyMode === mode ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                color: currentReplyMode === mode ? "#10b981" : "#fff",
                padding: "8px 14px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: currentReplyMode === mode ? "bold" : "normal"
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Running Auto Reply Conversations Console List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0", fontSize: "13px" }}>Active Auto Reply Executions</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {runningConversations.map((c) => (
          <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", borderLeft: "4px solid #10b981" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <div>
                <strong style={{ fontSize: "13px" }}>{c.senderName}</strong>
                <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "8px" }}>(Page: {c.pageId})</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", fontWeight: "bold" }}>
                  {c.replyMode}
                </span>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" }}>
                  Delay: {c.delaySeconds}s
                </span>
                {c.isFallback && (
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>
                    Fallback Reply
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
              <strong>Incoming:</strong> "{c.lastMessageText}"
            </div>
            <div style={{ fontSize: "12px", color: "#10b981", marginBottom: "6px" }}>
              <strong>Auto Reply:</strong> "{c.generatedReply}"
            </div>

            <div style={{ fontSize: "10px", color: "#9ca3af" }}>
              Processed: {c.processedAt}
            </div>
          </div>
        ))}
        {runningConversations.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No active auto reply executions running.</div>
        )}
      </div>
    </div>
  )
}
