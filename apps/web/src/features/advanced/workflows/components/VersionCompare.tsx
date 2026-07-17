"use client"

import React from "react"

interface VersionCompareProps {
  isOpen: boolean
  onClose: () => void
  v1Number: number
  v2Number: number
  diff: {
    nodesAdded: string[]
    nodesRemoved: string[]
    propertyChanges: string[]
  } | null
}

export default function VersionCompare({ isOpen, onClose, v1Number, v2Number, diff }: VersionCompareProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 w-full max-w-md space-y-4 text-xs font-mono">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h4 className="text-sm font-bold text-slate-200">
            Compare Versions: v{v1Number}.0 vs v{v2Number}.0
          </h4>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-400">✕</button>
        </div>

        {diff ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {/* Added Nodes */}
            <div className="space-y-1">
              <div className="font-bold text-emerald-400">Nodes Added ({diff.nodesAdded.length})</div>
              {diff.nodesAdded.length === 0 ? (
                <div className="text-slate-600 pl-3">None</div>
              ) : (
                diff.nodesAdded.map((id) => (
                  <div key={id} className="pl-3 text-slate-300">+ {id}</div>
                ))
              )}
            </div>

            {/* Removed Nodes */}
            <div className="space-y-1">
              <div className="font-bold text-red-400">Nodes Removed ({diff.nodesRemoved.length})</div>
              {diff.nodesRemoved.length === 0 ? (
                <div className="text-slate-600 pl-3">None</div>
              ) : (
                diff.nodesRemoved.map((id) => (
                  <div key={id} className="pl-3 text-slate-300">- {id}</div>
                ))
              )}
            </div>

            {/* Modified Properties */}
            <div className="space-y-1">
              <div className="font-bold text-orange-400">Property Changes ({diff.propertyChanges.length})</div>
              {diff.propertyChanges.length === 0 ? (
                <div className="text-slate-600 pl-3">None</div>
              ) : (
                diff.propertyChanges.map((prop) => (
                  <div key={prop} className="pl-3 text-slate-300">~ {prop}</div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-4">No differences detected. Content hashes match.</div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded font-semibold"
          >
            Close Diff Explorer
          </button>
        </div>
      </div>
    </div>
  )
}
