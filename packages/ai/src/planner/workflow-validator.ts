export interface ValidationIssue {
  type: "DISCONNECTED_NODE" | "MISSING_TRIGGER" | "CYCLE_DETECTED" | "DEAD_BRANCH"
  nodeId?: string
  message: string
}

export class WorkflowValidator {
  public static validate(nodes: any[], edges: any[]): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (nodes.length === 0) {
      return issues
    }

    // 1. Missing Trigger Validation
    const hasTrigger = nodes.some((n) => n.type.toLowerCase().includes("trigger"))
    if (!hasTrigger) {
      issues.push({
        type: "MISSING_TRIGGER",
        message: "Workflow does not contain an execution trigger node.",
      })
    }

    // 2. Disconnected Nodes Validation
    const connectedNodeIds = new Set<string>()
    for (const edge of edges) {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    }

    for (const node of nodes) {
      // If workflow has multiple nodes but this node has no connections
      if (nodes.length > 1 && !connectedNodeIds.has(node.id)) {
        issues.push({
          type: "DISCONNECTED_NODE",
          nodeId: node.id,
          message: `Node ${node.id} is disconnected.`,
        })
      }
    }

    return issues
  }
}
