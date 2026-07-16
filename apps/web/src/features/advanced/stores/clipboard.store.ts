import { create } from "zustand"

interface ClipboardState {
  copiedNodeData: any | null
  setCopiedNodeData: (data: any) => void
}

export const useAdvancedClipboardStore = create<ClipboardState>((set) => ({
  copiedNodeData: null,
  setCopiedNodeData: (copiedNodeData) => set({ copiedNodeData }),
}))
