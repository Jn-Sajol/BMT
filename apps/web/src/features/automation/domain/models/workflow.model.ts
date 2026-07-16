import { WorkflowNode, WorkflowEdge } from "../types"

export class WorkflowAggregate {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly workspaceId: string,
    public nodes: WorkflowNode[] = [],
    public edges: WorkflowEdge[] = []
  ) {}

  public addNode(node: WorkflowNode): void {
    if (this.nodes.some((n) => n.id === node.id)) {
      throw new Error(`Node with ID ${node.id} already exists in workflow.`)
    }
    this.nodes.push(node)
  }

  public removeNode(nodeId: string): void {
    this.nodes = this.nodes.filter((n) => n.id !== nodeId)
    this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
  }

  public addEdge(edge: WorkflowEdge): void {
    if (this.edges.some((e) => e.id === edge.id)) {
      throw new Error(`Edge with ID ${edge.id} already exists in workflow.`)
    }
    // Verify source and target exist
    if (!this.nodes.some((n) => n.id === edge.source) || !this.nodes.some((n) => n.id === edge.target)) {
      throw new Error("Edge source and target nodes must exist in the workflow.")
    }
    this.edges.push(edge)
  }

  public removeEdge(edgeId: string): void {
    this.edges = this.edges.filter((e) => e.id !== edgeId)
  }
}
