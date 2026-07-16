import { create } from "zustand"

type Theme = "dark" | "light" | "system"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: typeof window !== "undefined"
    ? (localStorage.getItem("bmt_theme") as Theme || "system")
    : "system",
  setTheme: (theme) => {
    localStorage.setItem("bmt_theme", theme)
    set({ theme })
  },
}))
