"use client"

import React, { useState } from "react"

interface CommentItem {
  id: string
  nodeId: string | null
  author: string
  content: string
  createdAt: string
  parentCommentId: string | null
  isResolved: boolean
}

interface CommentSidebarProps {
  comments: CommentItem[]
  onAddComment: (content: string, nodeId: string | null, parentId: string | null) => void
  onResolve: (id: string) => void
}

export default function CommentSidebar({ comments, onAddComment, onResolve }: CommentSidebarProps) {
  const [content, setContent] = useState("")
  const [nodeId, setNodeId] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    onAddComment(content, nodeId || null, null)
    setContent("")
    setNodeId("")
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col h-full text-xs font-mono text-slate-300">
      <div className="border-b border-slate-800 pb-2 mb-4">
        <h4 className="text-sm font-bold text-slate-200">Comment Threads</h4>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {comments.length === 0 ? (
          <div className="text-slate-600 text-center py-8">No comments on this workflow.</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-2 border border-slate-800 bg-slate-950/40 rounded space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-orange-400">@{c.author}</span>
                <span className="text-slate-600">{c.createdAt.substring(11, 16)}</span>
              </div>
              <p className="text-slate-200">{c.content}</p>
              {c.nodeId && <div className="text-[10px] text-slate-500 bg-slate-950 px-1 py-0.5 rounded inline-block">Node: {c.nodeId}</div>}
              
              <div className="flex justify-end space-x-2 pt-1">
                {!c.isResolved ? (
                  <button
                    onClick={() => onResolve(c.id)}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-600 italic">Resolved</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-800 pt-4 mt-4 space-y-2">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500">Node ID (Optional):</label>
          <input
            type="text"
            placeholder="e.g. node-1"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 outline-none text-slate-300"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500">Message Content:</label>
          <textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 outline-none text-slate-300 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold transition-colors"
        >
          Send Comment
        </button>
      </form>
    </div>
  )
}
