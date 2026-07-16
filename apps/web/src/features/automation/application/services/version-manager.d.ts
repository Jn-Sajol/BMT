import { WorkflowVersion, WorkflowNode, WorkflowEdge } from "../../domain/types";
export declare class WorkflowVersionManager {
    private versions;
    createVersion(version: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowVersion;
    getVersion(version: string): WorkflowVersion | undefined;
    listVersions(): WorkflowVersion[];
    rollbackTo(version: string): {
        nodes: WorkflowNode[];
        edges: WorkflowEdge[];
    };
}
