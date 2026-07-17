import { Injectable } from "@nestjs/common"
import { WorkflowDraft } from "../../domain/workflow-draft.model"

@Injectable()
export class DraftService {
  private drafts = new Map<string, WorkflowDraft>()

  public getDraft(workflowId: string): WorkflowDraft | null {
    return this.drafts.get(workflowId) || null
  }

  public autosaveDraft(
    workflowId: string,
    nodes: any[],
    edges: any[],
    variables: Record<string, any>,
    userId: string
  ): WorkflowDraft {
    const existing = this.drafts.get(workflowId)
    const versionNumber = existing ? existing.versionNumber : 1

    const draft: WorkflowDraft = {
      id: existing ? existing.id : `draft-${workflowId}`,
      workflowId,
      nodes,
      edges,
      variables,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
      versionNumber,
    }

    this.drafts.set(workflowId, draft)
    return draft
  }

  public clearDraft(workflowId: string): void {
    this.drafts.delete(workflowId)
  }
}
