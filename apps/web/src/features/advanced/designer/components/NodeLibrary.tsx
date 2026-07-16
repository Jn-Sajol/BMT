"use client"

import React, { useState } from "react"
import { NodeRegistry } from "automation-nodes"

export default function NodeLibrary() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")

  const nodes = NodeRegistry.list()

  // Filter definitions based on search key and selected category
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = node.name.toLowerCase().includes(search.toLowerCase()) ||
                          node.provider.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "ALL" || node.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const onDragStart = (event: React.DragEvent, nodeId: string, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow-type", nodeType)
    event.dataTransfer.setData("application/reactflow-label", label)
    event.dataTransfer.setData("application/reactflow-id", nodeId)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Node Library SDK</h2>
      
      {/* Search and Filters */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-slate-700 px-3 py-1.5 bg-slate-900 text-xs text-white"
        />

        <div className="flex space-x-1 overflow-x-auto pb-1">
          {["ALL", "TRIGGER", "ACTION", "CONDITION", "AI"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                selectedCategory === cat
                  ? "bg-orange-600 border-orange-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => onDragStart(e, node.id, node.category, node.name)}
            className="border bg-slate-900 hover:bg-slate-800 p-2.5 rounded-lg text-xs font-medium cursor-grab text-white flex flex-col space-y-1 border-slate-700/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-orange-400 font-semibold uppercase">{node.category}</span>
              <span className="text-[9px] text-slate-500 font-mono">v{node.version}</span>
            </div>
            <div className="font-bold text-white">{node.name}</div>
            <div className="text-[10px] text-slate-400">{node.provider} Integration</div>
          </div>
        ))}

        {filteredNodes.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-6">No matching nodes found.</div>
        )}
      </div>
    </div>
  )
}
