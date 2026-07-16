import { create } from "zustand"

export interface AutomationNode {
  id: string
  type: string
  label: string
}

interface WorkflowState {
  nodes: AutomationNode[]
  setNodes: (nodes: AutomationNode[]) => void
  clearWorkflow: () => void
}

export const useAdvancedWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
  clearWorkflow: () => set({ nodes: [] }),
}))
