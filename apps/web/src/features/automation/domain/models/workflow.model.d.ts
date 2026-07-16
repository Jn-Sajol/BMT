import { WorkflowNode, WorkflowEdge } from "../types";
export declare class WorkflowAggregate {
    readonly id: string;
    name: string;
    readonly workspaceId: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    constructor(id: string, name: string, workspaceId: string, nodes?: WorkflowNode[], edges?: WorkflowEdge[]);
    addNode(node: WorkflowNode): void;
    removeNode(nodeId: string): void;
    addEdge(edge: WorkflowEdge): void;
    removeEdge(edgeId: string): void;
}
