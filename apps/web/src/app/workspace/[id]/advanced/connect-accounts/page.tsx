"use client"

import React, { useState } from "react"

export default function AdvancedConnectAccountsPage() {
  const [connectedCount, setConnectedCount] = useState(3)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"OAuth" | "Manual">("OAuth")

  const [accounts, setAccounts] = useState([
    { id: "acc-1", name: "CARE HUB BD", type: "Facebook Page", status: "Active", permissions: "pages_manage_posts, pages_read_engagement", connectedVia: "Facebook OAuth 2.0" },
    { id: "acc-2", name: "Julkar Nayeem (Primary ID)", type: "Facebook ID", status: "Active", permissions: "Full Automation Scope", connectedVia: "Facebook OAuth 2.0" },
    { id: "acc-3", name: "Corporate Brand Page", type: "Facebook Page", status: "Active", permissions: "pages_manage_posts", connectedVia: "Manual Developer Token" },
  ])

  // Simulate 1-Click Facebook OAuth Login
  const handleFacebookOAuthLogin = () => {
    const newPage = {
      id: `acc-${Date.now()}`,
      name: "New Connected Page (Via 1-Click Facebook)",
      type: "Facebook Page",
      status: "Active",
      permissions: "pages_manage_posts, pages_read_engagement",
      connectedVia: "1-Click Facebook OAuth",
    }
    setAccounts([newPage, ...accounts])
    setConnectedCount(prev => prev + 1)
    setShowConnectModal(false)
    alert("✅ Success! Facebook OAuth Login Complete. 'New Connected Page' has been securely linked without manual tokens!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Connect Facebook Accounts & Pages</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Seamless 1-Click Official Facebook Login for End-Clients & Developers. No technical knowledge required for clients.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
            {connectedCount} / 100 Connected
          </span>
          <button
            onClick={() => setShowConnectModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Connect Facebook Page / ID</span>
          </button>
        </div>
      </div>

      {/* Account Table */}
      <div className="border bg-card rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted border-b uppercase text-[10px] font-extrabold text-muted-foreground">
            <tr>
              <th className="p-4">Account / Page Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Connection Method</th>
              <th className="p-4">Status</th>
              <th className="p-4">Permissions Granted</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-muted/50 transition">
                <td className="p-4 font-bold text-sm text-foreground flex items-center space-x-2">
                  <span className="text-lg">{acc.type === "Facebook Page" ? "📄" : "👤"}</span>
                  <span>{acc.name}</span>
                </td>
                <td className="p-4 text-muted-foreground font-medium">{acc.type}</td>
                <td className="p-4">
                  <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {acc.connectedVia}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    {acc.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground font-mono text-[11px]">{acc.permissions}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setAccounts(accounts.filter(a => a.id !== acc.id))
                      setConnectedCount(prev => prev - 1)
                    }}
                    className="text-red-500 hover:text-red-700 font-bold hover:underline"
                  >
                    Disconnect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base">Connect Facebook Account or Page</h3>
              <button onClick={() => setShowConnectModal(false)} className="text-muted-foreground hover:text-foreground font-bold">✕</button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("OAuth")}
                className={`py-2 rounded-lg transition ${activeTab === "OAuth" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                🔵 1-Click Client Login (Recommended)
              </button>
              <button
                onClick={() => setActiveTab("Manual")}
                className={`py-2 rounded-lg transition ${activeTab === "Manual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                🛠️ Developer Manual Token
              </button>
            </div>

            {/* TAB 1: 1-CLICK OAUTH */}
            {activeTab === "OAuth" && (
              <div className="space-y-4 text-xs">
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 rounded-xl space-y-2">
                  <h4 className="font-extrabold text-blue-900 dark:text-blue-200 text-sm">Zero-Technical Client Onboarding</h4>
                  <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-[11px]">
                    Clients do NOT need developer accounts or tokens. Clicking below opens the official Facebook popup where the client selects their Page and grants 1-click permission.
                  </p>
                </div>

                <button
                  onClick={handleFacebookOAuthLogin}
                  className="w-full py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>
            )}

            {/* TAB 2: MANUAL TOKEN */}
            {activeTab === "Manual" && (
              <div className="space-y-4 text-xs">
                <p className="text-muted-foreground text-[11px]">
                  For agency developers or custom API integrations, paste a Page Access Token manually below:
                </p>
                <div className="space-y-1">
                  <label className="font-bold">Meta Page Access Token (EAAG...)</label>
                  <textarea rows={3} className="w-full border rounded-xl p-2.5 font-mono text-[11px] bg-muted/20" placeholder="EAAG..." />
                </div>
                <button
                  onClick={() => {
                    alert("Token saved manually!")
                    setShowConnectModal(false)
                  }}
                  className="w-full py-2.5 bg-foreground text-background font-extrabold rounded-xl text-xs"
                >
                  Save Custom Token
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
