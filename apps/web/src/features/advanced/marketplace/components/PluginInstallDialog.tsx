"use client"

import React from "react"

interface PluginInstallDialogProps {
  isOpen: boolean
  mode: "INSTALL" | "UNINSTALL"
  pluginName: string
  onClose: () => void
  onConfirm: () => void
}

export default function PluginInstallDialog({ isOpen, mode, pluginName, onClose, onConfirm }: PluginInstallDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 w-full max-w-sm space-y-4 text-xs font-mono">
        <div>
          <h4 className="text-sm font-bold text-slate-200">
            {mode === "INSTALL" ? "Install Plugin Extension?" : "Uninstall Plugin Extension?"}
          </h4>
          <p className="text-slate-500 mt-1">
            Are you sure you want to {mode.toLowerCase()} <span className="font-bold text-orange-400">"{pluginName}"</span>?
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-1.5 rounded text-white font-semibold ${
              mode === "INSTALL" ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
