import { create } from "zustand"

interface LayoutState {
  showSidebar: boolean
  showConsole: boolean
  toggleSidebar: () => void
  toggleConsole: () => void
}

export const useAdvancedLayoutStore = create<LayoutState>((set) => ({
  showSidebar: true,
  showConsole: true,
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  toggleConsole: () => set((state) => ({ showConsole: !state.showConsole })),
}))
