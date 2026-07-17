import { Injectable, OnModuleInit } from "@nestjs/common"
import { AIRegistry, MockAIProvider, OpenAIProvider, GeminiProvider, AnthropicProvider, WorkflowPlanner, WorkflowValidator, WorkflowOptimizer } from "ai-copilot"

@Injectable()
export class AIService implements OnModuleInit {
  private planner = new WorkflowPlanner()
  private optimizer = new WorkflowOptimizer()

  onModuleInit() {
    // Register providers on module start
    AIRegistry.register("mock", new MockAIProvider())
    AIRegistry.register("openai", new OpenAIProvider())
    AIRegistry.register("gemini", new GeminiProvider())
    AIRegistry.register("anthropic", new AnthropicProvider())
  }

  public async generateWorkflow(prompt: string, providerName: string) {
    const startTime = Date.now()
    const plan = await this.planner.planWorkflow(prompt, providerName)

    // 1. Run Workflow Validation (Trigger existence, Disconnected branches checks)
    const validationIssues = WorkflowValidator.validate(plan.nodes, plan.edges)
    const latency = Date.now() - startTime

    // 2. Track Simulated Token Usage and latency metrics
    const usage = {
      promptTokens: 15,
      completionTokens: 40,
      totalTokens: 55,
      latencyMs: latency,
      provider: providerName,
      model: "default-model",
    }

    console.log(
      `[AIService] Planned workflow using ${providerName} completed in ${latency}ms with ${validationIssues.length} issues.`
    )

    return {
      plan,
      validationIssues,
      usage,
    }
  }

  public async optimizeWorkflow(nodes: any[], edges: any[], providerName: string) {
    const startTime = Date.now()
    const suggestions = await this.optimizer.optimize(nodes, edges, providerName)
    const latency = Date.now() - startTime

    return {
      suggestions,
      usage: {
        promptTokens: 10,
        completionTokens: 25,
        totalTokens: 35,
        latencyMs: latency,
        provider: providerName,
      },
    }
  }
}
