import { create } from "zustand"

interface DesignerState {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useAdvancedDesignerStore = create<DesignerState>((set) => ({
  activeTab: "editor",
  setActiveTab: (activeTab) => set({ activeTab }),
}))
