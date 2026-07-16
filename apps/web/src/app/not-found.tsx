import React from "react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="text-muted-foreground">The resource you requested does not exist.</p>
      <Link href="/workspaces" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
        Return Home
      </Link>
    </div>
  )
}
