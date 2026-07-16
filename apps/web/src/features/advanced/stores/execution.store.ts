import { create } from "zustand"

interface ExecutionState {
  logs: string[]
  addLog: (log: string) => void
  clearLogs: () => void
}

export const useAdvancedExecutionStore = create<ExecutionState>((set) => ({
  logs: ["[System] Engine initialized. Ready to compile rules."],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
}))
