import { Injectable, NotFoundException } from "@nestjs/common"
import { WorkflowVersion } from "../../domain/workflow-version.model"
import { DraftService } from "./draft.service"
import * as crypto from "crypto"

@Injectable()
export class VersionService {
  private versions = new Map<string, WorkflowVersion[]>()
  private publishedVersions = new Map<string, WorkflowVersion>()

  constructor(private readonly draftService: DraftService) {}

  public listVersions(workflowId: string): WorkflowVersion[] {
    return this.versions.get(workflowId) || []
  }

  public getPublishedVersion(workflowId: string): WorkflowVersion | null {
    return this.publishedVersions.get(workflowId) || null
  }

  public publishDraft(
    workflowId: string,
    author: string,
    changeSummary: string
  ): WorkflowVersion {
    const draft = this.draftService.getDraft(workflowId)
    if (!draft) {
      throw new NotFoundException(`No draft found for workflow ${workflowId} to publish.`)
    }

    const existingList = this.versions.get(workflowId) || []
    const nextNumber = existingList.length + 1

    // 1. Generate SHA-256 checksum hash of contents
    const payloadStr = JSON.stringify({
      nodes: draft.nodes,
      edges: draft.edges,
      variables: draft.variables,
    })
    const contentHash = crypto.createHash("sha256").update(payloadStr).digest("hex")

    const parentVersionId = existingList.length > 0 ? existingList[existingList.length - 1].id : null

    // 2. Create IMMUTABLE version snapshot
    const version: WorkflowVersion = {
      id: `ver-${workflowId}-${nextNumber}`,
      workflowId,
      versionNumber: nextNumber,
      author,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      parentVersionId,
      rollbackSourceVersionNumber: null,
      contentHash,
      changeSummary,
      nodes: draft.nodes,
      edges: draft.edges,
      variables: draft.variables,
    }

    existingList.push(version)
    this.versions.set(workflowId, existingList)
    this.publishedVersions.set(workflowId, version)

    // Clear current draft state
    this.draftService.clearDraft(workflowId)

    console.log(`[VersionService] Workflow ${workflowId} published new version v${nextNumber}`)
    return version
  }

  public rollbackToVersion(
    workflowId: string,
    targetVersionNumber: number,
    author: string
  ): WorkflowVersion {
    const list = this.versions.get(workflowId) || []
    const targetVersion = list.find((v) => v.versionNumber === targetVersionNumber)

    if (!targetVersion) {
      throw new NotFoundException(
        `Version ${targetVersionNumber} not found for workflow ${workflowId}.`
      )
    }

    // Rollback never edits history: creates a NEW version snapshot copying target content
    const nextNumber = list.length + 1
    const payloadStr = JSON.stringify({
      nodes: targetVersion.nodes,
      edges: targetVersion.edges,
      variables: targetVersion.variables,
    })
    const contentHash = crypto.createHash("sha256").update(payloadStr).digest("hex")

    const rollbackVersion: WorkflowVersion = {
      id: `ver-${workflowId}-${nextNumber}`,
      workflowId,
      versionNumber: nextNumber,
      author,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      parentVersionId: list[list.length - 1].id,
      rollbackSourceVersionNumber: targetVersionNumber,
      contentHash,
      changeSummary: `Rollback to version v${targetVersionNumber}`,
      nodes: targetVersion.nodes,
      edges: targetVersion.edges,
      variables: targetVersion.variables,
    }

    list.push(rollbackVersion)
    this.versions.set(workflowId, list)
    this.publishedVersions.set(workflowId, rollbackVersion)

    console.log(
      `[VersionService] Rollback executed for ${workflowId}: created new version v${nextNumber} copied from v${targetVersionNumber}`
    )
    return rollbackVersion
  }
}
