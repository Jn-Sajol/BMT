"use client"

import React from "react"

export interface CandidateDisplayItem {
  candidateId: string
  groupId: string
  groupName: string
  groupUrl: string
  numericScore: number
  rank: "HIGH" | "MEDIUM" | "LOW"
  status: "Pending" | "Approved" | "Rejected" | "Archived"
  addedAt: string
}

interface Props {
  discoveredGroupsCount: number
  filteredGroupsCount: number
  highScoreCount: number
  mediumScoreCount: number
  lowScoreCount: number
  pendingCandidatesCount: number
  approvedCandidatesCount: number
  rejectedCandidatesCount: number
  archivedCandidatesCount: number
  exportStatus: "Ready" | "Exporting" | "Completed"
  pluginHealth: "Healthy" | "Degraded"
  frameworkStatus: "Active" | "Standby"
  candidates: CandidateDisplayItem[]
  onUpdateCandidateStatus: (candidateId: string, status: "Approved" | "Rejected" | "Archived") => void
  onExport: (format: "CSV" | "JSON" | "EXCEL") => void
}

export function GroupHunterDashboard({
  discoveredGroupsCount,
  filteredGroupsCount,
  highScoreCount,
  mediumScoreCount,
  lowScoreCount,
  pendingCandidatesCount,
  approvedCandidatesCount,
  rejectedCandidatesCount,
  archivedCandidatesCount,
  exportStatus,
  pluginHealth,
  frameworkStatus,
  candidates,
  onUpdateCandidateStatus,
  onExport
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Facebook Group Hunter Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Requirement #17 | Group Discovery, Rule-Based Scoring, & Export Engine</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => onExport("CSV")}
            style={{ background: "#3b82f6", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport("JSON")}
            style={{ background: "#10b981", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
          >
            Export JSON
          </button>
          <button
            onClick={() => onExport("EXCEL")}
            style={{ background: "#f59e0b", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
          >
            Export Excel
          </button>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "10px" }}>
            Framework: <strong style={{ color: "#10b981" }}>{frameworkStatus}</strong>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{discoveredGroupsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Discovered Groups</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{filteredGroupsCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Filtered Groups</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>{highScoreCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>High Score</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{mediumScoreCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Medium Score</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#6b7280" }}>{lowScoreCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Low Score</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{pendingCandidatesCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Pending Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{approvedCandidatesCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Approved</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ef4444" }}>{rejectedCandidatesCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Rejected</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#9ca3af" }}>{archivedCandidatesCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Archived</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Candidate Group Review Queue */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0", fontSize: "13px" }}>Group Candidates Review Queue (No Auto Join)</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {candidates.map((c) => {
          const rankColor = c.rank === "HIGH" ? "#ef4444" : c.rank === "MEDIUM" ? "#f59e0b" : "#3b82f6"
          
          return (
            <div key={c.candidateId} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", borderLeft: `4px solid ${rankColor}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div>
                  <strong style={{ fontSize: "13px" }}>{c.groupName}</strong>
                  <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "8px" }}>(Score: {c.numericScore}/100)</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: rankColor, fontWeight: "bold" }}>
                    {c.rank} Rank
                  </span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" }}>
                    Status: {c.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: "11px", color: "#3b82f6", marginBottom: "8px" }}>
                <a href={c.groupUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>{c.groupUrl}</a>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>Discovered: {c.addedAt}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {c.status === "Pending" && (
                    <>
                      <button
                        onClick={() => onUpdateCandidateStatus(c.candidateId, "Approved")}
                        style={{ background: "#10b981", border: "none", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdateCandidateStatus(c.candidateId, "Rejected")}
                        style={{ background: "#ef4444", border: "none", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onUpdateCandidateStatus(c.candidateId, "Archived")}
                        style={{ background: "#6b7280", border: "none", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", cursor: "pointer" }}
                      >
                        Archive
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {candidates.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No candidate groups found in hunter queue.</div>
        )}
      </div>
    </div>
  )
}
