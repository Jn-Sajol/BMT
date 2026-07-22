"use client"

import React from "react"

export interface LeadCandidateDisplay {
  commentId: string
  authorId: string
  leadScore: number
  detectedLanguage: string
  matchedKeywords: string[]
  riskLevel: "Low" | "Medium" | "High"
}

interface Props {
  collectedBatchesCount: number
  processingQueueCount: number
  leadQueueCount: number
  duplicatesRemovedCount: number
  processingThroughput: string
  leadScoreDistribution: { high: number; medium: number; low: number }
  languageDistribution: Record<string, number>
  leads: LeadCandidateDisplay[]
  pluginHealth: "Healthy" | "Degraded"
  onRunProcessing: () => void
}

export function CommentProcessingDashboard({
  collectedBatchesCount,
  processingQueueCount,
  leadQueueCount,
  duplicatesRemovedCount,
  processingThroughput,
  leadScoreDistribution,
  languageDistribution,
  leads,
  pluginHealth,
  onRunProcessing
}: Props) {
  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "#10b981", margin: 0 }}>Comment Processing & Lead Extraction Console</h3>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Client Req F-31 | AI Processing & Lead Scoring Foundation</span>
        </div>
        <button
          onClick={onRunProcessing}
          style={{ background: "#10b981", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Process Collected Batches
        </button>
      </div>

      {/* Overview Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{collectedBatchesCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Collected Batches</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>{processingQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Processing Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>{leadQueueCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Lead Candidate Queue</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b" }}>{duplicatesRemovedCount}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Duplicates Filtered</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{processingThroughput}</div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Throughput</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: pluginHealth === "Healthy" ? "#10b981" : "#ef4444" }}>
            ● {pluginHealth}
          </div>
          <span style={{ fontSize: "10px", color: "#9ca3af" }}>Plugin Health</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {/* Lead Score Distribution */}
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "6px" }}>
          <h4 style={{ color: "#10b981", margin: "0 0 8px 0", fontSize: "12px" }}>Lead Score Distribution</h4>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
            <span style={{ color: "#10b981" }}>High (70-100): {leadScoreDistribution.high}</span>
            <span style={{ color: "#f59e0b" }}>Medium (30-70): {leadScoreDistribution.medium}</span>
            <span style={{ color: "#9ca3af" }}>Low (0-30): {leadScoreDistribution.low}</span>
          </div>
        </div>
        {/* Language Distribution */}
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "6px" }}>
          <h4 style={{ color: "#10b981", margin: "0 0 8px 0", fontSize: "12px" }}>Language Distribution</h4>
          <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#9ca3af" }}>
            {Object.entries(languageDistribution).map(([lang, count]) => (
              <span key={lang}>{lang}: <strong>{count}</strong></span>
            ))}
          </div>
        </div>
      </div>

      {/* Scored Lead Candidates List */}
      <h4 style={{ color: "#10b981", margin: "0 0 12px 0" }}>Scored Lead Candidates Queue</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {leads.map((l) => {
          const scoreColor = l.leadScore >= 70 ? "#10b981" : l.leadScore >= 30 ? "#f59e0b" : "#9ca3af"
          return (
            <div key={l.commentId} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  Author: {l.authorId} <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>Lang: {l.detectedLanguage}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Matched Keywords: {l.matchedKeywords.length > 0 ? l.matchedKeywords.join(", ") : "None"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", color: scoreColor, fontWeight: "bold" }}>Score: {l.leadScore}/100</div>
                <div style={{ fontSize: "10px", color: "#9ca3af" }}>Risk Level: {l.riskLevel}</div>
              </div>
            </div>
          )
        })}
        {leads.length === 0 && (
          <div style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "12px" }}>No lead candidates scored yet.</div>
        )}
      </div>
    </div>
  )
}
