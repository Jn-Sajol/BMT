"use client"

import React from "react"

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex h-screen flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">A critical error occurred!</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="rounded bg-primary px-4 py-2 text-primary-foreground">
          Retry boot
        </button>
      </body>
    </html>
  )
}
