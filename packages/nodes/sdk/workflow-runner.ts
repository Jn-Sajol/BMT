import { NodeRegistry } from "./node-registry"
import { ExecutionContext } from "./execution-context"

export interface RunnerNode {
  id: string
  type: string
  properties: Record<string, any>
}

export interface RunnerEdge {
  id: string
  source: string
  target: string
}

export class WorkflowRunner {
  public static async execute(
    workflowId: string,
    executionId: string,
    nodes: RunnerNode[],
    edges: RunnerEdge[],
    initialVariables: Record<string, any> = {}
  ): Promise<{ status: "COMPLETED" | "FAILED"; logs: string[]; nodeOutputs: Record<string, any> }> {
    const context = new ExecutionContext(workflowId, executionId, initialVariables)
    context.log(`Commencing execution of workflow ${workflowId}`)

    // 1. Topological Sorting (Kahn's Algorithm)
    let sortedNodeIds: string[] = []
    try {
      sortedNodeIds = WorkflowRunner.topologicalSort(nodes, edges)
    } catch (e: any) {
      context.log(`Topological sort failed: ${e.message}`)
      return { status: "FAILED", logs: context.logs, nodeOutputs: context.nodeOutputs }
    }

    // 2. Sequential Node Execution
    for (const nodeId of sortedNodeIds) {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) continue

      const definition = NodeRegistry.get(node.type)
      if (!definition) {
        context.log(`Execution aborted: executor definition for node type ${node.type} not found in registry.`)
        return { status: "FAILED", logs: context.logs, nodeOutputs: context.nodeOutputs }
      }

      context.log(`Executing node ${node.id} ("${definition.name}")`)

      // Mocking node execution mapping definitions
      let output: any = {}
      try {
        // Run with retry logic
        output = await WorkflowRunner.executeWithRetry(async () => {
          // Check if custom validate passes
          const val = definition.propertiesSchema.safeParse(node.properties)
          if (!val.success) {
            throw new Error(`Node configuration validation failed: ${val.error.message}`)
          }
          
          // Execute mock output resolver based on type
          if (node.type === "webhook-trigger") {
            return { triggered: true, path: node.properties.path }
          }
          if (node.type === "openai-prompt") {
            const prompt = context.resolveVariables(node.properties.prompt)
            return { text: `AI Response for prompt: "${prompt}"` }
          }
          if (node.type === "meta-adjust-budget") {
            return { adjusted: true, campaign: node.properties.campaignId }
          }
          return { success: true }
        }, 3, 100) // 3 retries, 100ms backoff
        
        context.nodeOutputs[nodeId] = output
        context.log(`Node ${node.id} executed successfully.`)
      } catch (error: any) {
        context.log(`Node ${node.id} failed execution: ${error.message}`)
        return { status: "FAILED", logs: context.logs, nodeOutputs: context.nodeOutputs }
      }
    }

    context.log("Workflow completed successfully.")
    return {
      status: "COMPLETED",
      logs: context.logs,
      nodeOutputs: context.nodeOutputs,
    }
  }

  private static topologicalSort(nodes: RunnerNode[], edges: RunnerEdge[]): string[] {
    const inDegree: Record<string, number> = {}
    const adjList: Record<string, string[]> = {}

    nodes.forEach((n) => {
      inDegree[n.id] = 0
      adjList[n.id] = []
    })

    edges.forEach((e) => {
      if (adjList[e.source] && inDegree[e.target] !== undefined) {
        adjList[e.source].push(e.target)
        inDegree[e.target]++
      }
    })

    const queue: string[] = []
    nodes.forEach((n) => {
      if (inDegree[n.id] === 0) {
        queue.push(n.id)
      }
    })

    const result: string[] = []
    while (queue.length > 0) {
      const curr = queue.shift()!
      result.push(curr)

      const neighbors = adjList[curr] || []
      neighbors.forEach((n) => {
        inDegree[n]--
        if (inDegree[n] === 0) {
          queue.push(n)
        }
      })
    }

    if (result.length !== nodes.length) {
      throw new Error("Cyclic dependency detected in graph traversal.")
    }

    return result
  }

  private static async executeWithRetry<T>(fn: () => Promise<T>, retries: number, delayMs: number): Promise<T> {
    let attempt = 0
    while (attempt < retries) {
      try {
        return await fn()
      } catch (e) {
        attempt++
        if (attempt >= retries) throw e
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
    throw new Error("Execution failed after maximum retries.")
  }
}
