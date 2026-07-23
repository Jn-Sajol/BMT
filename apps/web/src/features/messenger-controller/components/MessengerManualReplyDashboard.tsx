"use client"

import React, { useState } from "react"

export interface ManualReplyInboxItem {
  id: string
  conversationId: string
  pageId: string
  senderName: string
  messageText: string
  suggestedReply: string
  confidence: number
  detectedIntent: string
  detectedLanguage: string
  status: "Pending" | "Approved" | "Rejected" | "Edited"
}

export interface SavedReplyOption {
  id: string
  title: string
  content: string
  category: string
}

interface Props {
  replyQueueCount: number
  verificationQueueCount: number
  retryQueueCount: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  inboxItems: ManualReplyInboxItem[]
  savedMessages: SavedReplyOption[]
  onApprove: (id: string, finalReplyText: string) => void
  onReject: (id: string) => void
  onEdit: (id: string, newReplyText: string) => void
}

export function MessengerManualReplyDashboard({
  replyQueueCount,
  verificationQueueCount,
  retryQueueCount,
  pluginHealth,
  frameworkStatus,
  inboxItems,
  savedMessages,
  onApprove,
  onReject,
  onEdit
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(inboxItems.length > 0 ? inboxItems[0].id : null)
  const [editedReply, setEditedReply] = useState<string>("")

  const activeItem = inboxItems.find((item) => item.id === selectedId) || inboxItems[0]

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Messenger Manual Reply Assistant Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #12 | Single Local Suggestion & Approval Console</span>
        </div>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
          Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
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

      {/* Main Console Split View */}
      {activeItem ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px" }}>
          {/* Left: Inbox List */}
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px", maxHeight: "400px", overflowY: "auto" }}>
            <h4 style={{ color: "#10b981", margin: "0 0 10px 0", fontSize: "13px" }}>Inbox Conversations</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {inboxItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id)
                    setEditedReply(item.suggestedReply)
                  }}
                  style={{
                    background: item.id === activeItem.id ? "rgba(16, 185, 129, 0.15)" : "rgba(255,255,255,0.03)",
                    border: item.id === activeItem.id ? "1px solid #10b981" : "1px solid transparent",
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px" }}>{item.senderName}</strong>
                    <span style={{ fontSize: "10px", color: "#f59e0b" }}>{item.status}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    "{item.messageText}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Suggestion & Approval Editor */}
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px", borderRadius: "6px" }}>
            <h4 style={{ color: "#10b981", margin: "0 0 10px 0", fontSize: "13px" }}>Reply Suggestion & Approval Editor</h4>
            
            {/* Metadata Badges */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "11px" }}>
              <span style={{ background: "rgba(255,255,255,0.08)", padding: "4px 8px", borderRadius: "4px" }}>
                Intent: <strong style={{ color: "#3b82f6" }}>{activeItem.detectedIntent}</strong>
              </span>
              <span style={{ background: "rgba(255,255,255,0.08)", padding: "4px 8px", borderRadius: "4px" }}>
                Confidence: <strong style={{ color: "#10b981" }}>{(activeItem.confidence * 100).toFixed(0)}%</strong>
              </span>
              <span style={{ background: "rgba(255,255,255,0.08)", padding: "4px 8px", borderRadius: "4px" }}>
                Lang: <strong style={{ color: "#f59e0b" }}>{activeItem.detectedLanguage}</strong>
              </span>
            </div>

            {/* Original Message */}
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "10px", background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "4px" }}>
              <strong>User Message:</strong> "{activeItem.messageText}"
            </div>

            {/* Reply Editor */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Optimized Reply Suggestion (Editable):</label>
              <textarea
                value={editedReply || activeItem.suggestedReply}
                onChange={(e) => setEditedReply(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "#fff",
                  padding: "8px",
                  fontSize: "12px",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Saved Messages Quick Selector */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>Select Saved Message from Library:</label>
              <select
                onChange={(e) => {
                  const found = savedMessages.find((s) => s.id === e.target.value)
                  if (found) setEditedReply(found.content)
                }}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "#fff",
                  padding: "6px",
                  fontSize: "11px"
                }}
              >
                <option value="">-- Choose a template --</option>
                {savedMessages.map((sm) => (
                  <option key={sm.id} value={sm.id}>
                    [{sm.category}] {sm.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => onApprove(activeItem.id, editedReply || activeItem.suggestedReply)}
                style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
              >
                Approve & Send
              </button>
              <button
                onClick={() => onEdit(activeItem.id, editedReply)}
                style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
              >
                Save Edits
              </button>
              <button
                onClick={() => onReject(activeItem.id)}
                style={{ background: "#ef4444", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No messenger conversations in manual reply queue.</div>
      )}
    </div>
  )
}
