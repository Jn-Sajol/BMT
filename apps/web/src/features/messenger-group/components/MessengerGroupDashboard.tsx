"use client"

import React from "react"

export interface MessengerGroupDisplayItem {
  groupId: string
  groupName: string
  participantCount: number
  lastMessage: string
  unreadCount: number
  category: "SALES" | "BUY_SELL" | "LOCAL" | "SUPPORT" | "COMMUNITY" | "UNKNOWN"
  language: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  lastActivity: string
}

interface Props {
  totalGroupsCount: number
  unreadGroupsCount: number
  campaignPreparationQueueCount: number
  retryQueueCount: number
  verificationQueueCount: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  groups: MessengerGroupDisplayItem[]
  onRefreshGroups: () => void
}

export function MessengerGroupDashboard({
  totalGroupsCount,
  unreadGroupsCount,
  campaignPreparationQueueCount,
  retryQueueCount,
  verificationQueueCount,
  pluginHealth,
  frameworkStatus,
  groups,
  onRefreshGroups
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Messenger Group Assistant Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #13 | Group Intelligence & Campaign Preparation Foundation</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={onRefreshGroups}
            style={{
              background: "#10b981",
              border: "none",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px"
            }}
          >
            Refresh Groups
          </button>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{totalGroupsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Total Groups</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{unreadGroupsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Unread Groups</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{campaignPreparationQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Campaign Prep Queue</span>
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

      {/* Discovered Messenger Groups Console List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0", fontSize: "13px" }}>Discovered Messenger Groups & Intelligence</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {groups.map((g) => {
          const priorityColor = g.priority === "HIGH" ? "#ef4444" : g.priority === "MEDIUM" ? "#f59e0b" : "#3b82f6"
          
          return (
            <div key={g.groupId} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", borderLeft: `4px solid ${priorityColor}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div>
                  <strong style={{ fontSize: "13px" }}>{g.groupName}</strong>
                  <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "8px" }}>({g.participantCount} members)</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.2)", color: "#10b981", fontWeight: "bold" }}>
                    {g.category}
                  </span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.05)" }}>
                    {g.language}
                  </span>
                  <span style={{ fontSize: "10px", color: priorityColor, fontWeight: "bold" }}>
                    {g.priority} Priority
                  </span>
                </div>
              </div>
              
              <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>
                Last message: "{g.lastMessage}"
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#9ca3af" }}>
                <span>Unread Count: {g.unreadCount} | Last Activity: {g.lastActivity}</span>
                <span style={{ fontStyle: "italic", color: "#10b981" }}>Foundation Ready (No Auto Sending)</span>
              </div>
            </div>
          )
        })}
        {groups.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No messenger groups discovered in workspace foundation.</div>
        )}
      </div>
    </div>
  )
}
