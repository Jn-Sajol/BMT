import { IAIProvider, AIMessage, AIResponse } from "../core/ai-provider.interface"
import { Observable, of } from "rxjs"

export class MockAIProvider implements IAIProvider {
  public async complete(messages: AIMessage[]): Promise<AIResponse> {
    const userPrompt = messages.find((m) => m.role === "user")?.content || ""

    if (userPrompt.toLowerCase().includes("optimize")) {
      return {
        content: JSON.stringify({
          suggestions: [
            {
              reason: "Unused node detected",
              confidence: 0.95,
              affectedNodes: ["node-unused"],
              potentialRisks: "Bloats workflow config execution footprint.",
            },
          ],
        }),
        usage: { promptTokens: 10, completionTokens: 25, totalTokens: 35 },
      }
    }

    // Default mock workflow plan response
    return {
      content: JSON.stringify({
        nodes: [
          { id: "node-1", type: "webhook-trigger", properties: {} },
          { id: "node-2", type: "openai-prompt", properties: { prompt: "Generate title" } },
        ],
        edges: [{ id: "edge-1", source: "node-1", target: "node-2" }],
        variables: {},
        description: "Generated Mock Workflow description.",
        warnings: [],
      }),
      usage: { promptTokens: 15, completionTokens: 40, totalTokens: 55 },
    }
  }

  public stream(messages: AIMessage[]): Observable<string> {
    return of("Simulated", " ", "streaming", " ", "response", " ", "blocks.")
  }
}
