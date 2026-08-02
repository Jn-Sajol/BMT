"use client"

import React, { useState } from "react"

export default function AdvancedUnfriendInactivePage() {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

  const mockInactiveFriends = [
    { id: "in-1", name: "Sabbir Hossain", account: "Julkar Nayeem (ID)", inactiveDays: "180+ Days Inactive", engagementScore: "0%" },
    { id: "in-2", name: "Anisur Rahman", account: "Julkar Nayeem (ID)", inactiveDays: "240+ Days Inactive", engagementScore: "0%" },
    { id: "in-3", name: "Fahim Shahriar", account: "Agency Account 03", inactiveDays: "365+ Days Inactive", engagementScore: "0%" },
  ]

  const toggleSelect = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unfriend Inactive Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detect inactive friends with zero engagement across connected accounts and execute clean single or bulk unfriend actions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert(`Unfriending ${selectedFriends.length} selected inactive friends...`)}
            disabled={selectedFriends.length === 0}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            🧹 Unfriend Selected ({selectedFriends.length})
          </button>
          <button
            onClick={() => alert("Unfriending ALL detected inactive friends across accounts...")}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            🔥 Unfriend All Inactive Friends
          </button>
        </div>
      </div>

      <div className="border bg-card rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted border-b uppercase text-[10px] font-bold text-muted-foreground">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFriends(mockInactiveFriends.map(f => f.id))
                    } else {
                      setSelectedFriends([])
                    }
                  }}
                />
              </th>
              <th className="p-4">Friend Name</th>
              <th className="p-4">Connected Account</th>
              <th className="p-4">Inactive Status</th>
              <th className="p-4">Engagement Score</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockInactiveFriends.map((friend) => (
              <tr key={friend.id} className="hover:bg-muted/50 transition">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend.id)}
                    onChange={() => toggleSelect(friend.id)}
                  />
                </td>
                <td className="p-4 font-semibold text-sm">{friend.name}</td>
                <td className="p-4 text-muted-foreground">{friend.account}</td>
                <td className="p-4">
                  <span className="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    {friend.inactiveDays}
                  </span>
                </td>
                <td className="p-4 font-medium text-muted-foreground">{friend.engagementScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
