import { create } from "zustand"

interface SelectionState {
  selectedNodeId: string | null
  setSelectedNodeId: (id: string | null) => void
}

export const useAdvancedSelectionStore = create<SelectionState>((set) => ({
  selectedNodeId: null,
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
}))
