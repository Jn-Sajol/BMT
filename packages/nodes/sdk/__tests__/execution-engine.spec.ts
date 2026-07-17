import { WorkflowRunner, RunnerNode, RunnerEdge } from "../workflow-runner"
import { ExecutionContext } from "../execution-context"
import { NodeRegistry } from "../node-registry"
import { WebhookNodeDefinition } from "../../core/webhook.node"
import { OpenAiNodeDefinition } from "../../providers/openai.node"
import { MetaCreateCampaignNode } from "../../providers/meta-write.node"

describe("WorkflowExecutionEngine", () => {
  beforeAll(() => {
    // Clear and register mock definitions
    NodeRegistry.clear()
    NodeRegistry.register(WebhookNodeDefinition)
    NodeRegistry.register(OpenAiNodeDefinition)
    NodeRegistry.register(MetaCreateCampaignNode)
  })

  it("should parse trigger and workflow variables context correctly", () => {
    const context = new ExecutionContext(
      "wf-1",
      "run-1",
      {
        trigger: { payload: { id: "user-100" } },
        targetName: "Test Campaign",
      }
    )

    // Verify trigger payload resolution
    const resolvedTrigger = context.resolveVariables("Trigger ID: {{trigger.payload.id}}")
    expect(resolvedTrigger).toBe("Trigger ID: user-100")

    // Verify workflow variables resolution
    const resolvedVar = context.resolveVariables("Name: {{workflow.variables.targetName}}")
    expect(resolvedVar).toBe("Name: Test Campaign")
  })

  it("should traverse and execute trigger and action nodes sequentially", async () => {
    const nodes: RunnerNode[] = [
      { id: "node-1", type: "webhook-trigger", properties: { path: "/events", method: "POST" } },
      { id: "node-2", type: "openai-prompt", properties: { prompt: "Hello {{node-1.output.path}}", apiKeyRef: { credentialId: "cred-1" } } },
    ]
    const edges: RunnerEdge[] = [
      { id: "edge-1", source: "node-1", target: "node-2" },
    ]

    const result = await WorkflowRunner.execute("wf-123", "exec-456", nodes, edges)
    expect(result.status).toBe("COMPLETED")
    expect(result.nodeOutputs["node-1"].path).toBe("/events")
    expect(result.nodeOutputs["node-2"].text).toContain('prompt: "Hello /events"')
  })

  it("should successfully execute meta write nodes campaigns", async () => {
    const nodes: RunnerNode[] = [
      { id: "node-1", type: "meta-create-campaign", properties: { name: "Leads Q3", objective: "OUTCOME_LEADS", credentialId: "cred-oauth" } },
    ]
    const result = await WorkflowRunner.execute("wf-123", "exec-456", nodes, [])
    expect(result.status).toBe("COMPLETED")
    expect(result.nodeOutputs["node-1"].campaignId).toBe("c-mock-999")
  })

  it("should trigger compensating actions logs if meta validation fails", async () => {
    const nodes: RunnerNode[] = [
      { id: "node-1", type: "meta-create-campaign", properties: { name: "", objective: "OUTCOME_LEADS", credentialId: "cred-oauth" } },
    ]
    const result = await WorkflowRunner.execute("wf-123", "exec-456", nodes, [])
    expect(result.status).toBe("FAILED")
    expect(result.logs.some((l) => l.includes("[COMPENSATING_ACTION]"))).toBe(true)
  })

  it("should fail execution if cyclic graphs exist", async () => {
    const nodes: RunnerNode[] = [
      { id: "node-1", type: "webhook-trigger", properties: { path: "/events", method: "POST" } },
      { id: "node-2", type: "openai-prompt", properties: { prompt: "Hello", apiKeyRef: { credentialId: "cred-1" } } },
    ]
    const edges: RunnerEdge[] = [
      { id: "edge-1", source: "node-1", target: "node-2" },
      { id: "edge-2", source: "node-2", target: "node-1" },
    ]

    const result = await WorkflowRunner.execute("wf-123", "exec-456", nodes, edges)
    expect(result.status).toBe("FAILED")
    expect(result.logs.some((l) => l.includes("Cyclic dependency detected"))).toBe(true)
  })
})
