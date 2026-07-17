"use client"

import React, { useState } from "react"

interface PromptEditorProps {
  onGenerate: (prompt: string) => void
}

export default function PromptEditor({ onGenerate }: PromptEditorProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    onGenerate(prompt)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border border-slate-800 bg-slate-900/40 rounded-lg text-xs font-mono text-slate-300">
      <div className="font-bold text-slate-200">Natural Language Workflow Planner</div>
      <textarea
        placeholder="Describe your automation flow (e.g. Schedule hourly Meta campaign budget updates...)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-24 bg-slate-950 border border-slate-800 rounded p-2 outline-none text-slate-300 resize-none placeholder:text-slate-700"
      />
      <button
        type="submit"
        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-colors"
      >
        Generate Workflow Plan
      </button>
    </form>
  )
}
