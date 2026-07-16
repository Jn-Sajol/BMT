import { WorkflowDraft, WorkflowNode, WorkflowEdge } from "../../domain/types"

export class WorkflowDraftManager {
  private activeDrafts = new Map<string, WorkflowDraft>()

  public saveDraft(id: string, name: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowDraft {
    const draft: WorkflowDraft = {
      id,
      name,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      updatedAt: new Date().toISOString(),
    }
    this.activeDrafts.set(id, draft)
    return draft
  }

  public getDraft(id: string): WorkflowDraft | undefined {
    return this.activeDrafts.get(id)
  }

  public discardDraft(id: string): boolean {
    return this.activeDrafts.delete(id)
  }
}
