import { Injectable } from "@nestjs/common"

export interface WorkflowDiff {
  nodesAdded: string[]
  nodesRemoved: string[]
  edgesAdded: string[]
  edgesRemoved: string[]
  propertyChanges: string[]
}

@Injectable()
export class CompareService {
  public compare(v1: any, v2: any): WorkflowDiff {
    const diff: WorkflowDiff = {
      nodesAdded: [],
      nodesRemoved: [],
      edgesAdded: [],
      edgesRemoved: [],
      propertyChanges: [],
    }

    const v1Nodes = new Map<string, any>((v1.nodes || []).map((n: any) => [n.id, n]))
    const v2Nodes = new Map<string, any>((v2.nodes || []).map((n: any) => [n.id, n]))

    // Check node additions and properties
    for (const [id, node] of v2Nodes) {
      if (!v1Nodes.has(id)) {
        diff.nodesAdded.push(id)
      } else {
        const oldNode = v1Nodes.get(id)
        if (JSON.stringify(oldNode.properties) !== JSON.stringify(node.properties)) {
          diff.propertyChanges.push(`node:${id}:properties`)
        }
      }
    }

    // Check node removals
    for (const id of v1Nodes.keys()) {
      if (!v2Nodes.has(id)) {
        diff.nodesRemoved.push(id)
      }
    }

    return diff
  }
}
