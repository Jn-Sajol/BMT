"use client"

import React from "react"
import { useTheme } from "../hooks/useTheme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme() // Applies active theme class at startup
  return <>{children}</>
}
