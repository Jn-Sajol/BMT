import { Controller, Post, Body } from "@nestjs/common"
import { AIService } from "./ai.service"

@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post("generate")
  generateWorkflow(
    @Body("prompt") prompt: string,
    @Body("provider") provider: string
  ) {
    return this.aiService.generateWorkflow(prompt, provider || "mock")
  }

  @Post("optimize")
  optimizeWorkflow(
    @Body("nodes") nodes: any[],
    @Body("edges") edges: any[],
    @Body("provider") provider: string
  ) {
    return this.aiService.optimizeWorkflow(nodes, edges, provider || "mock")
  }

  @Post("explain")
  explainWorkflow(
    @Body("nodes") nodes: any[],
    @Body("edges") edges: any[]
  ) {
    // Generate explanation payload
    return {
      explanation: "This workflow initiates when trigger conditions match, subsequently calling a series of actions.",
      executionOrder: ["node-1", "node-2"],
      affectedNodes: nodes.map((n) => n.id),
      risks: "No risks detected.",
    }
  }
}
