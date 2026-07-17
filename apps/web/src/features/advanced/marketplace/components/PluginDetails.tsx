"use client"

import React from "react"

interface PluginManifest {
  id: string
  name: string
  version: string
  author: string
  description: string
  category: string
  permissions: string[]
  minPlatformVersion: string
}

interface PluginDetailsProps {
  plugin: PluginManifest
  isOpen: boolean
  onClose: () => void
}

export default function PluginDetails({ plugin, isOpen, onClose }: PluginDetailsProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 w-full max-w-sm space-y-4 text-xs font-mono">
        <div>
          <h4 className="text-sm font-bold text-slate-200">{plugin.name}</h4>
          <span className="text-[10px] text-slate-500">Author: {plugin.author}</span>
        </div>

        <div className="space-y-2 border-t border-b border-slate-850 py-3 text-slate-400">
          <div><span className="font-bold text-slate-300">Category:</span> {plugin.category}</div>
          <div><span className="font-bold text-slate-300">Minimum Platform:</span> v{plugin.minPlatformVersion}</div>
          <div className="space-y-1">
            <span className="font-bold text-slate-300">Permissions Requested:</span>
            <div className="flex flex-wrap gap-1">
              {plugin.permissions.map((perm) => (
                <span key={perm} className="px-1.5 py-0.5 bg-red-950/20 border border-red-950/30 rounded text-red-400 text-[9px] uppercase tracking-wider">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
