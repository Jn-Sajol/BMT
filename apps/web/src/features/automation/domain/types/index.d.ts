export type WorkflowNodeType = "TRIGGER" | "ACTION" | "CONDITION" | "DELAY" | "LOOP" | "AI" | "VARIABLE" | "MERGE" | "SPLIT" | "WEBHOOK" | "HTTP_REQUEST" | "NOTIFICATION" | "DATABASE" | "SCHEDULE";
export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    label: string;
    config: Record<string, any>;
}
export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
}
export interface WorkflowVersion {
    version: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: string;
}
export interface WorkflowDraft {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    updatedAt: string;
}
