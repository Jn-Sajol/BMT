"use client"

import React, { useState } from "react"
import PluginDetails from "./PluginDetails"
import PluginInstallDialog from "./PluginInstallDialog"

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

export default function PluginMarketplace() {
  const [available] = useState<PluginManifest[]>([
    { id: "slack-plugin", name: "Slack Integration Channel", version: "1.0.0", author: "Official", description: "Send channel slack messages from workflows", category: "Messaging", permissions: ["network", "notifications"], minPlatformVersion: "1.0" },
    { id: "premium-shopify", name: "Shopify Store Sync", version: "1.1.0", author: "Community", description: "Trigger automations on store orders", category: "E-Commerce", permissions: ["network", "webhooks"], minPlatformVersion: "1.0" },
  ])

  const [installed, setInstalled] = useState<string[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<PluginManifest | null>(null)
  const [dialogPlugin, setDialogPlugin] = useState<{ plugin: PluginManifest; mode: "INSTALL" | "UNINSTALL" } | null>(null)

  const handleConfirmInstall = (id: string) => {
    setInstalled((prev) => [...prev, id])
  }

  const handleConfirmUninstall = (id: string) => {
    setInstalled((prev) => prev.filter((item) => item !== id))
  }

  return (
    <div className="space-y-4 text-xs font-mono text-slate-300 p-4 border border-slate-800 bg-slate-900/30 rounded-lg">
      <div className="border-b border-slate-800 pb-2 mb-4">
        <h4 className="text-sm font-bold text-slate-200">BMT Plugin Marketplace</h4>
        <p className="text-slate-500 mt-1">Discover, install, and update custom platform node extensions.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {available.map((p) => {
          const isInst = installed.includes(p.id)
          return (
            <div key={p.id} className="p-3 border border-slate-800 bg-slate-950/40 rounded-lg flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-400">{p.name}</span>
                  <span className="text-[10px] text-slate-500">v{p.version}</span>
                </div>
                <p className="text-slate-400">{p.description}</p>
                <div className="text-[10px] text-slate-650 flex flex-wrap gap-1 pt-1">
                  {p.permissions.map((perm) => (
                    <span key={perm} className="px-1.5 py-0.5 bg-slate-950 rounded text-slate-500">{perm}</span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setSelectedPlugin(p)}
                  className="text-slate-500 hover:text-slate-400 underline"
                >
                  View Details
                </button>

                {isInst ? (
                  <button
                    onClick={() => setDialogPlugin({ plugin: p, mode: "UNINSTALL" })}
                    className="px-2.5 py-1 bg-red-900/30 hover:bg-red-900/40 text-red-400 rounded font-semibold"
                  >
                    Uninstall
                  </button>
                ) : (
                  <button
                    onClick={() => setDialogPlugin({ plugin: p, mode: "INSTALL" })}
                    className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold"
                  >
                    Install
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedPlugin && (
        <PluginDetails
          plugin={selectedPlugin}
          isOpen={true}
          onClose={() => setSelectedPlugin(null)}
        />
      )}

      {dialogPlugin && (
        <PluginInstallDialog
          isOpen={true}
          mode={dialogPlugin.mode}
          pluginName={dialogPlugin.plugin.name}
          onClose={() => setDialogPlugin(null)}
          onConfirm={() => {
            if (dialogPlugin.mode === "INSTALL") {
              handleConfirmInstall(dialogPlugin.plugin.id)
            } else {
              handleConfirmUninstall(dialogPlugin.plugin.id)
            }
            setDialogPlugin(null)
          }}
        />
      )}
    </div>
  )
}
