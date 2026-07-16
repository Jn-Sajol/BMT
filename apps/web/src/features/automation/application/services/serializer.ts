import { WorkflowNode, WorkflowEdge, WorkflowVersion } from "../../domain/types"

export class WorkflowSerializer {
  public static serialize(nodes: WorkflowNode[], edges: WorkflowEdge[]): string {
    return JSON.stringify({ nodes, edges })
  }

  public static deserialize(json: string): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
    const data = JSON.parse(json)
    if (!data.nodes || !data.edges) {
      throw new Error("Invalid serialized workflow JSON configuration.")
    }
    return {
      nodes: data.nodes,
      edges: data.edges,
    }
  }

  public static exportTemplate(name: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): string {
    const payload = {
      templateName: name,
      exportedAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      graph: { nodes, edges },
    }
    return JSON.stringify(payload, null, 2)
  }

  public static importTemplate(json: string): { name: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
    const data = JSON.parse(json)
    if (!data.templateName || !data.graph?.nodes || !data.graph?.edges) {
      throw new Error("Invalid template import file schema.")
    }
    return {
      name: data.templateName,
      nodes: data.graph.nodes,
      edges: data.graph.edges,
    }
  }

  public static computeDiff(v1: WorkflowVersion, v2: WorkflowVersion) {
    const addedNodes = v2.nodes.filter((n2) => !v1.nodes.some((n1) => n1.id === n2.id))
    const removedNodes = v1.nodes.filter((n1) => !v2.nodes.some((n2) => n2.id === n1.id))
    
    return {
      addedNodesCount: addedNodes.length,
      removedNodesCount: removedNodes.length,
      isIdentical: addedNodes.length === 0 && removedNodes.length === 0,
    }
  }
}
