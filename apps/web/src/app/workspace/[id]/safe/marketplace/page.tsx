"use client"

import React from "react"
import { useMarketplaceTemplates } from "../../../../../features/safe/marketplace/hooks/useMarketplaceTemplates"
import { useTemplateInstall } from "../../../../../features/safe/marketplace/hooks/useTemplateInstall"

export default function SafeMarketplacePage() {
  const { templates } = useMarketplaceTemplates()
  const { installTemplate, rollbackTemplate } = useTemplateInstall()

  // Fallback mock templates list
  const displayTemplates = templates.length > 0 ? templates : [
    { id: "tmpl-1", name: "Meta Ads Dynamic Bid Adjuster", version: "1.2.0", category: "Optimization", description: "Clones rule nodes to automatically cut budgets when CPC exceeds baseline settings.", isVerified: true },
    { id: "tmpl-2", name: "Slack Alerting Slackbot Hook", version: "1.0.0", category: "Notification", description: "Dispatches warnings directly to specified Slack integration channels.", isVerified: true },
  ]

  const handleInstall = async (id: string) => {
    await installTemplate({ id, payload: {} })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace Hub</h1>
        <p className="text-muted-foreground">Browse and deploy verified rule-based templates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {displayTemplates.map((tmpl: any) => (
          <div key={tmpl.id} className="border bg-card rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 rounded bg-muted text-muted-foreground">{tmpl.category}</span>
                {tmpl.isVerified && (
                  <span className="text-xs text-emerald-500 font-semibold">✓ Verified Signature</span>
                )}
              </div>
              <h3 className="text-xl font-bold">{tmpl.name}</h3>
              <p className="text-sm text-muted-foreground">{tmpl.description}</p>
              <div className="text-xs text-muted-foreground">Version: {tmpl.version}</div>
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <button
                onClick={() => rollbackTemplate(tmpl.id)}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-muted text-muted-foreground"
              >
                Rollback version
              </button>
              <button
                onClick={() => handleInstall(tmpl.id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
              >
                Install Draft
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
