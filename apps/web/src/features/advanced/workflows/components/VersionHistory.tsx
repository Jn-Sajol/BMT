"use client"

import React from "react"

interface VersionItem {
  id: string
  versionNumber: number
  author: string
  publishedAt: string
  changeSummary: string
  contentHash: string
}

interface VersionHistoryProps {
  versions: VersionItem[]
  onRollback: (versionNumber: number) => void
  onCompare: (v1: number, v2: number) => void
}

export default function VersionHistory({ versions, onRollback, onCompare }: VersionHistoryProps) {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <h4 className="text-sm font-bold text-slate-200">Version History Mappings</h4>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {versions.length === 0 ? (
          <div className="text-slate-500 text-center py-4">No published versions yet.</div>
        ) : (
          versions.map((v) => (
            <div key={v.id} className="p-3 border border-slate-800 bg-slate-900/40 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange-400">v{v.versionNumber}.0</span>
                <span className="text-slate-500 text-[10px]">{v.publishedAt}</span>
              </div>
              <div className="text-slate-300">{v.changeSummary}</div>
              <div className="text-[10px] text-slate-500 flex justify-between items-center pt-1">
                <span>By: {v.author}</span>
                <span className="truncate max-w-[120px]" title={v.contentHash}>Hash: {v.contentHash.substring(0, 12)}...</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/50">
                <button
                  onClick={() => onCompare(v.versionNumber, v.versionNumber)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-[10px] font-semibold"
                >
                  Compare
                </button>
                <button
                  onClick={() => onRollback(v.versionNumber)}
                  className="px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded text-[10px] font-semibold"
                >
                  Rollback
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
