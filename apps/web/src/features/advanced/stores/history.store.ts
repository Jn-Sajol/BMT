import { create } from "zustand"

interface HistoryState {
  past: any[]
  future: any[]
  pushState: (state: any) => void
  undo: (currentState: any) => any | null
  redo: (currentState: any) => any | null
  clearHistory: () => void
}

export const useAdvancedHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  pushState: (state) => {
    set((s) => ({
      past: [...s.past, JSON.parse(JSON.stringify(state))],
      future: [],
    }))
  },
  undo: (currentState) => {
    const { past } = get()
    if (past.length === 0) return null
    const previous = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)
    set((s) => ({
      past: newPast,
      future: [JSON.parse(JSON.stringify(currentState)), ...s.future],
    }))
    return previous
  },
  redo: (currentState) => {
    const { future } = get()
    if (future.length === 0) return null
    const nextState = future[0]
    const newFuture = future.slice(1)
    set((s) => ({
      past: [...s.past, JSON.parse(JSON.stringify(currentState))],
      future: newFuture,
    }))
    return nextState
  },
  clearHistory: () => set({ past: [], future: [] }),
}))
