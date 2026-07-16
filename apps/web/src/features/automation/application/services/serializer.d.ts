import { WorkflowNode, WorkflowEdge, WorkflowVersion } from "../../domain/types";
export declare class WorkflowSerializer {
    static serialize(nodes: WorkflowNode[], edges: WorkflowEdge[]): string;
    static deserialize(json: string): {
        nodes: WorkflowNode[];
        edges: WorkflowEdge[];
    };
    static exportTemplate(name: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): string;
    static importTemplate(json: string): {
        name: string;
        nodes: WorkflowNode[];
        edges: WorkflowEdge[];
    };
    static computeDiff(v1: WorkflowVersion, v2: WorkflowVersion): {
        addedNodesCount: number;
        removedNodesCount: number;
        isIdentical: boolean;
    };
}
