"use client"

import React from "react"

export default function PromptHistory() {
  const prompts = [
    { title: "Meta Campaign Builder", prompt: "Create a Meta marketing campaign, adding standard trigger tags." },
    { title: "Slack Alert Dispatcher", prompt: "Notify Slack channels when webhooks trigger runtime updates." },
  ]

  return (
    <div className="p-4 border border-slate-800 bg-slate-900/30 rounded-lg text-xs font-mono text-slate-300 space-y-3">
      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 font-sans">Prompt Template Library</div>
      <div className="space-y-2">
        {prompts.map((p, idx) => (
          <div key={idx} className="p-2 border border-slate-800 bg-slate-950/40 rounded space-y-1">
            <div className="font-bold text-orange-400">{p.title}</div>
            <p className="text-slate-500 text-[10px]">{p.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
