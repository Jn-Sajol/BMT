"use client"

import React from "react"
import { useAdvancedSelectionStore } from "../../stores/selection.store"

export default function PropertiesPanel() {
  const { selectedNodeId } = useAdvancedSelectionStore()

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Properties Inspector</h2>

      {selectedNodeId ? (
        <div className="space-y-4 text-xs">
          <div>
            <span className="font-semibold text-muted-foreground">Selected Node ID: </span>
            <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-orange-500/20 text-orange-400">
              {selectedNodeId}
            </span>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-muted-foreground block">Condition Rule Expression</label>
            <input
              type="text"
              defaultValue="CPC > 1.20"
              className="w-full rounded border border-slate-700 px-2.5 py-1.5 bg-slate-900 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-muted-foreground block">Notification Channel</label>
            <select className="w-full rounded border border-slate-700 px-2.5 py-1.5 bg-slate-900 text-xs text-white">
              <option>Slack #ops-marketing</option>
              <option>Email Security Alert</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground text-center py-12">
          Select a node on the canvas to inspect variables.
        </div>
      )}
    </div>
  )
}
