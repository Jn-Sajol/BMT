"use client"

import React from "react"

interface ExplanationProps {
  explanation?: string
  executionOrder?: string[]
}

export default function WorkflowExplanation({ explanation, executionOrder }: ExplanationProps) {
  return (
    <div className="p-4 border border-slate-800 bg-slate-900/30 rounded-lg text-xs font-mono text-slate-300 space-y-3">
      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5">Workflow Explanation</div>
      <p className="text-slate-400">
        {explanation || "Generate an explanation to understand execution hierarchies and outputs."}
      </p>

      {executionOrder && executionOrder.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500">Execution Order:</div>
          <div className="flex items-center space-x-2">
            {executionOrder.map((step, idx) => (
              <React.Fragment key={step}>
                {idx > 0 && <span className="text-slate-700">→</span>}
                <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded">{step}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
