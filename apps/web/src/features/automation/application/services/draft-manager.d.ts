import { WorkflowDraft, WorkflowNode, WorkflowEdge } from "../../domain/types";
export declare class WorkflowDraftManager {
    private activeDrafts;
    saveDraft(id: string, name: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowDraft;
    getDraft(id: string): WorkflowDraft | undefined;
    discardDraft(id: string): boolean;
}
