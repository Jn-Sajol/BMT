"use client"

import React from "react"

export interface MessengerConversationDisplayItem {
  id: string
  conversationId: string
  pageId: string
  senderName: string
  lastMessageText: string
  category: "SALES" | "LEAD" | "SUPPORT" | "GENERAL" | "UNKNOWN"
  language: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  unreadCount: number
  isRead: boolean
  lastMessageTimestamp: string
}

interface Props {
  unreadConversationsCount: number
  conversationQueueCount: number
  retryQueueCount: number
  verificationQueueCount: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  conversations: MessengerConversationDisplayItem[]
  onMarkAsRead: (conversationId: string) => void
  onRefreshInbox: () => void
}

export function MessengerInboxDashboard({
  unreadConversationsCount,
  conversationQueueCount,
  retryQueueCount,
  verificationQueueCount,
  pluginHealth,
  frameworkStatus,
  conversations,
  onMarkAsRead,
  onRefreshInbox
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Messenger Controller Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #12 | Inbox Orchestration & Rule Classification</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={onRefreshInbox}
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
            Refresh Inbox
          </button>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{unreadConversationsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Unread Conversations</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{conversationQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Conversation Queue</span>
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

      {/* Classified Conversations Console List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Classified Messenger Conversations</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {conversations.map((c) => {
          const priorityColor = c.priority === "HIGH" ? "#ef4444" : c.priority === "MEDIUM" ? "#f59e0b" : "#3b82f6"
          const categoryBg = c.category === "SALES" ? "rgba(16, 185, 129, 0.2)" : c.category === "LEAD" ? "rgba(59, 130, 246, 0.2)" : c.category === "SUPPORT" ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.1)"
          
          return (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", borderLeft: `4px solid ${priorityColor}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div>
                  <strong style={{ fontSize: "13px" }}>{c.senderName}</strong>
                  <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "8px" }}>(Page: {c.pageId})</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: categoryBg, fontWeight: "bold" }}>
                    {c.category}
                  </span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.05)" }}>
                    {c.language}
                  </span>
                  <span style={{ fontSize: "10px", color: priorityColor, fontWeight: "bold" }}>
                    {c.priority} Priority
                  </span>
                </div>
              </div>
              
              <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>"{c.lastMessageText}"</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                  Received: {c.lastMessageTimestamp} | Unread Count: {c.unreadCount}
                </span>
                {!c.isRead && (
                  <button
                    onClick={() => onMarkAsRead(c.conversationId)}
                    style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "3px 8px", borderRadius: "3px", cursor: "pointer", fontSize: "10px" }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {conversations.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No messenger conversations in inbox queue.</div>
        )}
      </div>
    </div>
  )
}
