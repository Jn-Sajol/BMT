import { WorkflowNode, WorkflowEdge } from "../../domain/types";
export interface ValidationError {
    type: string;
    message: string;
    nodeId?: string;
    edgeId?: string;
}
export declare class WorkflowValidator {
    static validate(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[];
    private static detectCycleKahn;
}
