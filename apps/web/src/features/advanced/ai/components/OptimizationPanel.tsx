"use client"

import React, { useState } from "react"
import SuggestionPanel from "./SuggestionPanel"

export default function OptimizationPanel() {
  const [suggestions, setSuggestions] = useState<any[] | null>(null)

  const handleRequestOptimize = () => {
    setSuggestions([
      {
        reason: "Duplicate OpenAI prompts configured",
        confidence: 0.88,
        affectedNodes: ["node-openai-1", "node-openai-2"],
        risks: "Redundant tokens usage cost.",
      },
    ])
  }

  return (
    <div className="p-4 border border-slate-800 bg-slate-900/30 rounded-lg text-xs font-mono text-slate-300 space-y-3">
      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
        <span className="font-bold text-slate-200">Optimize Workflow</span>
        <button
          onClick={handleRequestOptimize}
          className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-semibold"
        >
          Run Optimizer
        </button>
      </div>

      {suggestions ? (
        <SuggestionPanel suggestions={suggestions} />
      ) : (
        <div className="text-slate-500 text-center py-4">Click "Run Optimizer" to evaluate design efficiency.</div>
      )}
    </div>
  )
}
