"use client"

import React from "react"

export interface AutoReplyJobDisplay {
  jobId: string
  commentId: string
  intent: string
  selectedTemplate: string
  delaySeconds: number
  scheduledTime: string
  status: "Scheduled" | "Executing" | "Verified" | "PolicyViolation" | "Failed"
  violationReason?: string
}

interface Props {
  autoReplyStatus: "Active" | "Disabled"
  runningJobsCount: number
  scheduledRepliesCount: number
  delayQueueCount: number
  verificationQueueCount: number
  retryQueueCount: number
  policyViolationsCount: number
  dailyReplyCount: number
  maxDailyLimit: number
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  jobs: AutoReplyJobDisplay[]
  onToggleAutoReply: () => void
}

export function CommentAutoReplyDashboard({
  autoReplyStatus,
  runningJobsCount,
  scheduledRepliesCount,
  delayQueueCount,
  verificationQueueCount,
  retryQueueCount,
  policyViolationsCount,
  dailyReplyCount,
  maxDailyLimit,
  pluginHealth,
  frameworkStatus,
  jobs,
  onToggleAutoReply
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>AI Auto Reply Engine Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #11 Completion | Auto Delay & Rule Rotation Engine</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={onToggleAutoReply}
            style={{
              background: autoReplyStatus === "Active" ? "#ef4444" : "#10b981",
              border: "none",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px"
            }}
          >
            {autoReplyStatus === "Active" ? "Pause Auto Reply" : "Enable Auto Reply"}
          </button>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: autoReplyStatus === "Active" ? "#10b981" : "#ef4444" }}>
            {autoReplyStatus}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Auto Reply Status</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{runningJobsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Running Jobs</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{scheduledRepliesCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Scheduled Replies</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{delayQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Delay Queue (30s-3m)</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{verificationQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Verification Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>{policyViolationsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Policy Violations</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{dailyReplyCount} / {maxDailyLimit}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Daily Reply Count</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Auto Reply Jobs Console */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Auto Reply Execution & Delay Queue</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {jobs.map((j) => {
          const statusColor = j.status === "Verified" ? "#10b981" : j.status === "Scheduled" ? "#f59e0b" : j.status === "PolicyViolation" ? "#ef4444" : "#3b82f6"
          return (
            <div key={j.jobId} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Comment ID: {j.commentId} <span style={{ fontSize: "10px", color: "#9ca3af" }}>(Intent: {j.intent} | Delay: {j.delaySeconds}s)</span>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Template: "{j.selectedTemplate}"
                </div>
                {j.violationReason && (
                  <div style={{ fontSize: "10px", color: "#ef4444", marginTop: "2px" }}>
                    Violation: {j.violationReason}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: statusColor, fontWeight: "bold" }}>{j.status}</div>
                <div style={{ fontSize: "10px", color: "#9ca3af" }}>{j.scheduledTime}</div>
              </div>
            </div>
          )
        })}
        {jobs.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No active auto reply jobs in delay queue.</div>
        )}
      </div>
    </div>
  )
}
