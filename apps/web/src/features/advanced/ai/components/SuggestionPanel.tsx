"use client"

import React from "react"

interface SuggestionItem {
  reason: string
  confidence: number
  affectedNodes: string[]
  risks?: string
}

interface SuggestionProps {
  suggestions: SuggestionItem[]
}

export default function SuggestionPanel({ suggestions }: SuggestionProps) {
  return (
    <div className="mt-3 pt-2 border-t border-slate-800 space-y-2 text-[10px] text-slate-400">
      <div className="font-bold text-slate-300">Suggestions:</div>
      {suggestions.map((s, idx) => (
        <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 space-y-1">
          <div>
            <span className="font-bold text-orange-400">Reason:</span> {s.reason}
          </div>
          <div className="flex justify-between">
            <span>Confidence: {(s.confidence * 100).toFixed(0)}%</span>
            <span>Nodes: {s.affectedNodes.join(", ")}</span>
          </div>
          {s.risks && <div><span className="font-bold text-red-400">Risks:</span> {s.risks}</div>}
        </div>
      ))}
    </div>
  )
}
