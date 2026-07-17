import { AIRegistry } from "../core/ai-registry"

export interface OptimizationSuggestion {
  reason: string
  confidence: number
  affectedNodes: string[]
  potentialRisks: string
}

export class WorkflowOptimizer {
  public async optimize(
    nodes: any[],
    edges: any[],
    providerName: string
  ): Promise<OptimizationSuggestion[]> {
    const provider = AIRegistry.resolve(providerName)
    const payloadStr = JSON.stringify({ nodes, edges })

    const response = await provider.complete([
      { role: "system", content: "Optimize the workflow nodes, detecting unused node duplicate risks." },
      { role: "user", content: payloadStr },
    ])

    const data = JSON.parse(response.content)
    return data.suggestions || []
  }
}
