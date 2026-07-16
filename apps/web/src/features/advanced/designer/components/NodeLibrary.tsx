"use client"

import React from "react"

const libraryNodes = [
  { type: "TRIGGER", label: "CPC Spike Trigger", category: "Triggers" },
  { type: "TRIGGER", label: "Schedule Interval", category: "Triggers" },
  { type: "ACTION", label: "Budget Adjuster", category: "Actions" },
  { type: "ACTION", label: "Slack Notifier", category: "Actions" },
]

export default function NodeLibrary() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow-type", nodeType)
    event.dataTransfer.setData("application/reactflow-label", label)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Node Catalog</h2>
      
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">Triggers</h3>
        <div className="space-y-2">
          {libraryNodes.filter((n) => n.type === "TRIGGER").map((node, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => onDragStart(e, node.type, node.label)}
              className="border bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg text-xs font-medium cursor-grab border-orange-500/30 text-white"
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">Actions</h3>
        <div className="space-y-2">
          {libraryNodes.filter((n) => n.type === "ACTION").map((node, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => onDragStart(e, node.type, node.label)}
              className="border bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg text-xs font-medium cursor-grab border-blue-500/30 text-white"
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>

      <div className="border border-orange-500/20 bg-orange-500/5 p-3 rounded-lg text-center mt-6">
        <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
          AI Assistant (Coming Soon)
        </span>
      </div>
    </div>
  )
}
