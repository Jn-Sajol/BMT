"use client"

import React, { useState } from "react"

export default function AuditExplorer() {
  const [filterType, setFilterType] = useState<string>("ALL")
  const [searchId, setSearchId] = useState<string>("")

  const audits = [
    { id: "aud-001", workflowId: "wf-1", triggerType: "cron", status: "SUCCESS", timestamp: "2026-07-17T03:00:00Z" },
    { id: "aud-002", workflowId: "wf-2", triggerType: "manual", status: "SUCCESS", timestamp: "2026-07-17T03:15:00Z" },
    { id: "aud-003", workflowId: "wf-1", triggerType: "webhook", status: "FAILED", timestamp: "2026-07-17T03:30:00Z" },
  ]

  const filteredAudits = audits.filter((a) => {
    const matchType = filterType === "ALL" || a.triggerType === filterType.toLowerCase()
    const matchSearch = searchId === "" || a.id.includes(searchId) || a.workflowId.includes(searchId)
    return matchType && matchSearch
  })

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b pb-2 border-slate-700">
        <h4 className="text-sm font-bold text-slate-200">Security & Execution Audits</h4>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
        <span className="text-slate-400">Filter Trigger:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-2 py-1 outline-none cursor-pointer"
        >
          <option value="ALL">All Triggers</option>
          <option value="CRON">Cron Scheduler</option>
          <option value="MANUAL">Manual Run</option>
          <option value="WEBHOOK">Meta Webhook</option>
        </select>

        <span className="text-slate-400 pl-2">Search ID:</span>
        <input
          type="text"
          placeholder="Workflow/Audit ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-2 py-1 outline-none placeholder:text-slate-700 flex-1"
        />
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
              <th className="p-3">Audit ID</th>
              <th className="p-3">Workflow ID</th>
              <th className="p-3">Trigger</th>
              <th className="p-3">Status</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.map((a) => (
              <tr key={a.id} className="border-b border-slate-800/50 text-slate-300 hover:bg-slate-900/20">
                <td className="p-3 font-bold text-orange-400">{a.id}</td>
                <td className="p-3">{a.workflowId}</td>
                <td className="p-3">{a.triggerType}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    a.status === "SUCCESS" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{a.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
