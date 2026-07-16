import { WorkflowVersion, WorkflowNode, WorkflowEdge } from "../../domain/types"

export class WorkflowVersionManager {
  private versions: WorkflowVersion[] = []

  public createVersion(version: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowVersion {
    if (this.versions.some((v) => v.version === version)) {
      throw new Error(`Version ${version} already exists in history.`)
    }
    const newVersion: WorkflowVersion = {
      version,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      createdAt: new Date().toISOString(),
    }
    this.versions.push(newVersion)
    return newVersion
  }

  public getVersion(version: string): WorkflowVersion | undefined {
    return this.versions.find((v) => v.version === version)
  }

  public listVersions(): WorkflowVersion[] {
    return [...this.versions]
  }

  public rollbackTo(version: string): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
    const target = this.getVersion(version)
    if (!target) {
      throw new Error(`Version ${version} not found in history logs.`)
    }
    return {
      nodes: JSON.parse(JSON.stringify(target.nodes)),
      edges: JSON.parse(JSON.stringify(target.edges)),
    }
  }
}
