"use client"

import React, { useState } from "react"

export default function AdvancedMessengerControllerPage() {
  const [conversionCategory, setConversionCategory] = useState("Sales Conversion")
  const [mode, setMode] = useState("AI_AUTO")

  const mockInboxMessages = [
    { id: "msg-1", sender: "Rahim Ahmed", message: "Hi, what is the price for this product?", category: "Sales Conversion", suggestedReply: "Hello Rahim! The product price is $49. We have a 10% discount today: https://yourlink.com" },
    { id: "msg-2", sender: "Tanvir Hossain", message: "Can I get a quick demo?", category: "Lead Conversion", suggestedReply: "Hi Tanvir! You can schedule a live demo here: https://yourlink.com/demo" },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messenger Controller Bot</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI Inbox Reply Assistant & Messenger Group Assistant for Marketplace accounts and pages.
        </p>
      </div>

      <div className="border bg-card p-6 rounded-xl space-y-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Conversation Category Style</label>
            <select
              value={conversionCategory}
              onChange={(e) => setConversionCategory(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="Sales Conversion">Sales Conversion (সেলস কনভার্সন)</option>
              <option value="Lead Conversion">Lead Conversion (লিড কনভার্সন)</option>
              <option value="Visit Conversion">Visit Conversion (ভিজিট কনভার্সন)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Operating Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="AI_AUTO">AI Auto Reply (Automatic Intent Detection)</option>
              <option value="AI_MANUAL">AI Manual Reply (Review & Approve Suggestions)</option>
            </select>
          </div>
        </div>

        {/* Inbox Display */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-base">Active Messenger Inbox</h3>
          <div className="space-y-3">
            {mockInboxMessages.map((msg) => (
              <div key={msg.id} className="border p-4 rounded-lg bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{msg.sender}</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded">
                    {msg.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">"{msg.message}"</p>

                <div className="border p-3 rounded bg-background text-xs space-y-2 border-orange-200 dark:border-orange-900">
                  <div className="font-semibold text-orange-700 dark:text-orange-400">🤖 Suggested AI Reply:</div>
                  <p>{msg.suggestedReply}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert(`Approved & sent reply to ${msg.sender}!`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg"
                  >
                    ✓ Approve & Send Reply
                  </button>
                  <button
                    onClick={() => alert("Editing reply...")}
                    className="border hover:bg-muted text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    ✏️ Edit Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
