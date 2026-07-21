"use client"

import React from "react"

interface AutomationJob {
  id: string
  title: string
  status: string
  publishedUrl?: string
  retries?: number
  errorMsg?: string
}

interface Props {
  job: AutomationJob | null
}

export function JobDetails({ job }: Props) {
  if (!job) return null

  return (
    <div style={{ color: "#fff", fontFamily: "sans-serif", marginTop: "20px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px" }}>
      <h4 style={{ color: "#3b82f6", margin: "0 0 12px 0" }}>Job Execution Logs</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Job ID:</span>
          <span style={{ fontFamily: "monospace" }}>{job.id}</span>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>Listing Title:</span>
          <b>{job.title}</b>
        </div>
        <div>
          <span style={{ color: "#9ca3af", display: "block" }}>State:</span>
          <span style={{ color: job.status === "Completed" ? "#10b981" : "#ef4444" }}>{job.status}</span>
        </div>
        {job.publishedUrl && (
          <div>
            <span style={{ color: "#9ca3af", display: "block" }}>Market URL:</span>
            <a href={job.publishedUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>{job.publishedUrl}</a>
          </div>
        )}
        {job.errorMsg && (
          <div style={{ background: "rgba(239,68,68,0.1)", padding: "8px", borderRadius: "4px", color: "#ef4444", fontSize: "12px" }}>
            <b>Error:</b> {job.errorMsg}
          </div>
        )}
      </div>
    </div>
  )
}
