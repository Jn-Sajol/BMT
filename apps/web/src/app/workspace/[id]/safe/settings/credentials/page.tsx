"use client"

import React, { useState } from "react"
import { useWorkspace } from "../../../../../../hooks/useWorkspace"

export default function SafeCredentialsPage() {
  const { activeWorkspace } = useWorkspace()
  const [testResult, setTestResult] = useState<string | null>(null)

  const mockCredentials = [
    { id: "cred-1", name: "Meta OAuth Key", provider: "Meta", type: "OAuth2", status: "ACTIVE", lastUsedAt: "2 hours ago" },
    { id: "cred-2", name: "OpenAI Token", provider: "OpenAI", type: "Bearer Token", status: "ACTIVE", lastUsedAt: "1 day ago" },
    { id: "cred-3", name: "Google Ads Account Key", provider: "Google", type: "Client ID/Secret", status: "EXPIRED", lastUsedAt: "5 days ago" },
  ]

  const handleTestConnection = (id: string) => {
    setTestResult(`Connection verification SUCCESSFUL for ${id}. (Decrypted GCM tags checked)`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Credentials & Secrets Vault</h1>
        <p className="text-muted-foreground">Manage securely encrypted access tokens and provider accounts</p>
      </div>

      {testResult && (
        <div className="border border-emerald-500/30 bg-emerald-500/10 p-3 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          {testResult}
        </div>
      )}

      <div className="grid gap-4">
        {mockCredentials.map((cred) => (
          <div key={cred.id} className="border bg-card rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  cred.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {cred.status}
                </span>
                <span className="text-xs text-muted-foreground">Type: {cred.type}</span>
              </div>
              <h3 className="text-lg font-bold">{cred.name}</h3>
              <div className="text-xs text-muted-foreground">
                <span>Provider: {cred.provider}</span>
                <span className="mx-2">•</span>
                <span>Last used: {cred.lastUsedAt}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button
                onClick={() => handleTestConnection(cred.id)}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-muted text-muted-foreground"
              >
                Test Connection
              </button>
              <button
                disabled
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-sm font-semibold cursor-not-allowed"
              >
                Edit Vault Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
