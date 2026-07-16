export interface AutomationNode {
    id: string;
    type: string;
    label: string;
}
interface WorkflowState {
    nodes: AutomationNode[];
    setNodes: (nodes: AutomationNode[]) => void;
    clearWorkflow: () => void;
}
export declare const useAdvancedWorkflowStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WorkflowState>>;
export {};
