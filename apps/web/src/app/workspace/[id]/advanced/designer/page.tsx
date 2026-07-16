"use client"

import React from "react"
import { useAdvancedShortcuts } from "../../../../../hooks/useShortcuts"
import Canvas from "../../../../../features/advanced/designer/components/Canvas"
import NodeLibrary from "../../../../../features/advanced/designer/components/NodeLibrary"
import PropertiesPanel from "../../../../../features/advanced/designer/components/PropertiesPanel"
import ExecutionConsole from "../../../../../features/advanced/designer/components/ExecutionConsole"

export default function AdvancedDesignerPage() {
  // Mount keyboard shortcuts listener hooks
  useAdvancedShortcuts()

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* 1. Designer Grid View */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left Side Node Catalog */}
        <div className="col-span-3 border bg-card rounded-xl p-4 flex flex-col space-y-4 overflow-auto">
          <NodeLibrary />
        </div>

        {/* Center xyflow Viewport */}
        <div className="col-span-6 border bg-card rounded-xl relative overflow-hidden bg-slate-950 text-white">
          <Canvas />
        </div>

        {/* Right Side Variables Inspector */}
        <div className="col-span-3 border bg-card rounded-xl p-4 flex flex-col space-y-4 overflow-auto">
          <PropertiesPanel />
        </div>
      </div>

      {/* 2. Bottom Log Terminal Pane */}
      <div className="h-44 border bg-card rounded-xl p-4 mt-6 flex flex-col justify-between overflow-hidden">
        <ExecutionConsole />
      </div>
    </div>
  )
}
