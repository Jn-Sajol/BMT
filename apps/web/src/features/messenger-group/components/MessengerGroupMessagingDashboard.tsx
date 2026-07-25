"use client"

import React from "react"

export interface GroupMessagingCampaignItem {
  campaignId: string
  groupId: string
  groupName: string
  selectedTemplateTitle: string
  variedMessageText: string
  delaySeconds: number
  status: "QUEUED" | "SCHEDULED" | "SENT" | "FAILED" | "SKIPPED"
  processedAt: string
}

interface Props {
  isCampaignActive: boolean
  preparedGroupsCount: number
  runningQueueCount: number
  delayQueueCount: number
  verificationQueueCount: number
  retryQueueCount: number
  dailySentCount: number
  dailyLimit: number
  policyViolationsCount: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  campaignExecutions: GroupMessagingCampaignItem[]
  onToggleCampaign: () => void
}

export function MessengerGroupMessagingDashboard({
  isCampaignActive,
  preparedGroupsCount,
  runningQueueCount,
  delayQueueCount,
  verificationQueueCount,
  retryQueueCount,
  dailySentCount,
  dailyLimit,
  policyViolationsCount,
  pluginHealth,
  frameworkStatus,
  campaignExecutions,
  onToggleCampaign
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Messenger Group Messaging Engine Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #13 Completion | Automated Group Campaign Pacing & Messaging</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={onToggleCampaign}
            style={{
              background: isCampaignActive ? "#10b981" : "#ef4444",
              border: "none",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px"
            }}
          >
            Campaign: {isCampaignActive ? "ACTIVE" : "PAUSED"}
          </button>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{preparedGroupsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Prepared Groups</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{runningQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Running Queue</span>
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
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{dailySentCount} / {dailyLimit}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Daily Sent Count</span>
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

      {/* Active Group Campaign Executions List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0", fontSize: "13px" }}>Group Campaign Messaging Executions</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {campaignExecutions.map((item) => (
          <div key={item.campaignId} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", borderLeft: "4px solid #10b981" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <div>
                <strong style={{ fontSize: "13px" }}>{item.groupName}</strong>
                <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "8px" }}>(Campaign ID: {item.campaignId})</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", fontWeight: "bold" }}>
                  Tmpl: {item.selectedTemplateTitle}
                </span>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" }}>
                  Pacing Delay: {item.delaySeconds}s
                </span>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: item.status === "SENT" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)", color: item.status === "SENT" ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
                  {item.status}
                </span>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#10b981", marginBottom: "6px" }}>
              <strong>Varied Message:</strong> "{item.variedMessageText}"
            </div>

            <div style={{ fontSize: "10px", color: "#9ca3af" }}>
              Processed: {item.processedAt}
            </div>
          </div>
        ))}
        {campaignExecutions.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No group messaging campaign executions running.</div>
        )}
      </div>
    </div>
  )
}
