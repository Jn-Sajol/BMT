import { AIRegistry } from "../core/ai-registry"
import { MockAIProvider } from "../providers/mock.provider"
import { WorkflowPlanner } from "../planner/workflow-planner"
import { WorkflowValidator } from "../planner/workflow-validator"

describe("AI Copilot & Workflow Intelligence Engine", () => {
  beforeEach(() => {
    AIRegistry.clear()
    AIRegistry.register("mock", new MockAIProvider())
  })

  it("should register and resolve AI providers dynamically", () => {
    const provider = AIRegistry.resolve("mock")
    expect(provider).toBeDefined()
    expect(provider).toBeInstanceOf(MockAIProvider)
  })

  it("should sanitize prompt guardrails recursively redacting confidential credentials", () => {
    const rawPrompt = "Generate trigger node using Bearer secretkey123 and ConfidentialID: conf-999"
    const sanitized = WorkflowPlanner.sanitizePrompt(rawPrompt)

    expect(sanitized).not.toContain("secretkey123")
    expect(sanitized).not.toContain("conf-999")
    expect(sanitized).toContain("[REDACTED]")
  })

  it("should plan workflows and return nodes and edges mapping", async () => {
    const planner = new WorkflowPlanner()
    const res = await planner.planWorkflow("Generate campaigns trigger", "mock")

    expect(res.nodes.length).toBe(2)
    expect(res.edges.length).toBe(1)
  })

  it("should run validation checks spotting missing triggers or disconnected node chains", () => {
    const nodes = [{ id: "node-2", type: "openai-prompt" }]
    const edges: any[] = []

    const issues = WorkflowValidator.validate(nodes, edges)
    expect(issues.some((i) => i.type === "MISSING_TRIGGER")).toBe(true)
  })
})
