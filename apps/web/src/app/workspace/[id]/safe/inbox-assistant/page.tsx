"use client"

import React, { useState } from "react"

interface WebhookInboxMessage {
  id: string
  senderName: string
  messageBody: string
  pageName: string
  receivedAt: string
  intent: "Sales Conversion" | "Lead Conversion" | "Visit Conversion"
  aiSuggestion: string
  status: "Pending" | "Replied"
}

export default function SafeInboxAssistantPage() {
  const [mode, setMode] = useState<"Manual" | "Auto">("Manual")

  const [inboxMessages, setInboxMessages] = useState<WebhookInboxMessage[]>([
    {
      id: "msg-1",
      senderName: "Kamrul Islam",
      messageBody: "আমি ঘড়িটা কিনতে চাই। অর্ডার কনফার্ম করব কীভাবে?",
      pageName: "Fashion Hub Official",
      receivedAt: "2 mins ago (Webhook Detected)",
      intent: "Sales Conversion",
      aiSuggestion: "আসসালামু আলাইকুম স্যার! প্রিমিয়াম ওয়াচটির অফার মূল্য ২,৪৯০ টাকা। অর্ডার করতে দয়া করে আপনার নাম, ঠিকানা ও ফোন নম্বরটি দিন।",
      status: "Pending",
    },
    {
      id: "msg-2",
      senderName: "Sharmin Sultana",
      messageBody: "আপনাদের শোরুমের লোকেশন কোথায়?",
      pageName: "Tech Gadgets BD",
      receivedAt: "10 mins ago (Webhook Detected)",
      intent: "Visit Conversion",
      aiSuggestion: "ধন্যবাদ! আমাদের শোরুমের ঠিকানা: লেভেল ৪, যমুনা ফিউচার পার্ক, ঢাকা। ভিজিট লিংক: https://bmt.link/location",
      status: "Pending",
    },
    {
      id: "msg-3",
      senderName: "Rahim Chowdhury",
      messageBody: "প্রোডাক্টের সাথে কি ওয়ারেন্টি থাকবে?",
      pageName: "Tech Gadgets BD",
      receivedAt: "25 mins ago (Webhook Detected)",
      intent: "Lead Conversion",
      aiSuggestion: "জি স্যার, আমাদের প্রতিটি ওয়াচের সাথে থাকছে ১ বছরের অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি এবং কার্ড।",
      status: "Pending",
    },
  ])

  const handleSendInboxReply = (id: string, text: string) => {
    setInboxMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Replied" } : m))
    )
    alert(`✓ Inbox Message Replied via Graph API: "${text}"`)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Inbox Reply Assistant</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time Inbox message detection via Webhooks, AI Intent Classification (Sales, Lead, Visit Conversion), Manual & Auto modes.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMode("Manual")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "Manual" ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🖐️ Manual Mode (Approve)
          </button>
          <button
            onClick={() => setMode("Auto")}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === "Auto" ? "bg-purple-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🤖 Auto Mode (Follow-up Queue)
          </button>
        </div>
      </div>

      {/* Intent Classification Overview Cards */}
      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        <div className="p-3.5 border rounded-xl bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-1">
          <span className="font-extrabold block uppercase text-[10px]">Sales Conversion</span>
          <span className="text-foreground font-semibold">Purchase Intent & Ordering</span>
        </div>
        <div className="p-3.5 border rounded-xl bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 space-y-1">
          <span className="font-extrabold block uppercase text-[10px]">Lead Conversion</span>
          <span className="text-foreground font-semibold">Product Spec & Warranty Queries</span>
        </div>
        <div className="p-3.5 border rounded-xl bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 space-y-1">
          <span className="font-extrabold block uppercase text-[10px]">Visit Conversion</span>
          <span className="text-foreground font-semibold">Location & Website Visits</span>
        </div>
      </div>

      {/* Webhook Messages List */}
      <div className="space-y-4 text-xs">
        <h2 className="font-extrabold text-sm border-b pb-2">Webhook Detected Inbox Messages ({inboxMessages.length})</h2>

        {inboxMessages.map((msg) => (
          <div key={msg.id} className="border bg-card p-4 rounded-xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="space-y-0.5">
                <span className="font-extrabold text-sm text-foreground">{msg.senderName}</span>
                <span className="text-[10px] text-muted-foreground block">Page: {msg.pageName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  Intent: {msg.intent}
                </span>
                <span className="text-muted-foreground text-[10px]">{msg.receivedAt}</span>
              </div>
            </div>

            <div className="p-2.5 bg-muted/20 rounded-lg text-foreground font-semibold">
              "{msg.messageBody}"
            </div>

            {msg.status === "Pending" ? (
              <div className="p-3 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 block text-[11px]">AI Suggested Reply:</span>
                <p className="text-muted-foreground font-medium leading-relaxed">{msg.aiSuggestion}</p>
                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleSendInboxReply(msg.id, msg.aiSuggestion)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg shadow-sm"
                  >
                    Approve & Send Inbox Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-[11px]">
                ✓ Sent via Graph API POST /page-id/messages
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
