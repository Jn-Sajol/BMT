"use client"

import React, { useState } from "react"
import SuggestionPanel from "./SuggestionPanel"

export default function AICopilotPanel() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I am your BMT AI Assistant. How can I help you design your marketing workflows today?" },
  ])
  const [input, setInput] = useState("")
  const [activeProvider, setActiveProvider] = useState("mock")

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I have analyzed your prompt. I suggest adding a Cron Trigger connected to a Meta Campaigns node.",
          suggestions: [
            { reason: "Connect trigger node to campaigns", confidence: 0.95, affectedNodes: ["trigger-1"], risks: "None" },
          ],
        },
      ])
    }, 1000)
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col h-full text-xs font-mono text-slate-300">
      <div className="border-b border-slate-800 pb-2 mb-4 flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-200">AI Copilot</h4>
        <select
          value={activeProvider}
          onChange={(e) => setActiveProvider(e.target.value)}
          className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 outline-none cursor-pointer text-[10px]"
        >
          <option value="mock">Mock Model</option>
          <option value="gemini">Gemini Pro</option>
          <option value="openai">GPT-4o</option>
        </select>
      </div>

      {/* Message logs */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-2 rounded border ${
            m.role === "assistant"
              ? "bg-slate-950/40 border-slate-800 text-slate-300"
              : "bg-orange-950/10 border-orange-850/30 text-orange-400"
          }`}>
            <div className="font-bold text-[10px] mb-1 capitalize">{m.role}</div>
            <p>{m.content}</p>
            {m.suggestions && <SuggestionPanel suggestions={m.suggestions} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="border-t border-slate-800 pt-4 mt-4 flex space-x-2">
        <input
          type="text"
          placeholder="Ask Copilot..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 outline-none text-slate-300 flex-1 placeholder:text-slate-700"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}
