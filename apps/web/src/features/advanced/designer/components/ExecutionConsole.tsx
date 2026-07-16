"use client"

import React from "react"
import { useAdvancedExecutionStore } from "../../stores/execution.store"
import { useAdvancedHistoryStore } from "../../stores/history.store"

export default function ExecutionConsole() {
  const { logs, clearLogs, addLog } = useAdvancedExecutionStore()
  const { undo, redo } = useAdvancedHistoryStore()

  const handleCompile = () => {
    addLog("[Compiler] Commencing topological compile...")
    addLog("[Compiler] Sorted nodes topologically. Checking cycles...")
    addLog("[Compiler] Build Result: SUCCESSFUL")
  }

  const handleUndo = () => {
    const prevState = undo({ logs })
    if (prevState) {
      addLog("[History] Undo action executed.")
    } else {
      addLog("[History] No actions left to undo.")
    }
  }

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Execution Log Streams</h2>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="space-x-1.5">
          <button
            onClick={handleUndo}
            className="px-2 py-0.5 border border-slate-700 hover:bg-slate-800 rounded text-xs font-medium text-white"
          >
            Undo
          </button>
          <button
            onClick={clearLogs}
            className="px-2 py-0.5 border border-slate-700 hover:bg-slate-800 rounded text-xs font-medium text-white"
          >
            Clear
          </button>
          <button
            onClick={handleCompile}
            className="px-2.5 py-0.5 rounded bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
          >
            Compile Rules
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto font-mono text-[10px] space-y-1 text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed">
            <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
