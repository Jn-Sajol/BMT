import { WorkflowValidator } from "../application/services/validator"
import { WorkflowNode, WorkflowEdge } from "../domain/types"

describe("WorkflowValidator", () => {
  it("should fail validation if there are no triggers", () => {
    const nodes: WorkflowNode[] = [
      { id: "node-1", type: "ACTION", label: "Cut Budget", config: {} },
    ]
    const edges: WorkflowEdge[] = []

    const errors = WorkflowValidator.validate(nodes, edges)
    expect(errors.some((e) => e.type === "MISSING_TRIGGER")).toBe(true)
  })

  it("should detect self loops and cycle dependencies via Kahn's algorithm", () => {
    const nodes: WorkflowNode[] = [
      { id: "trigger-1", type: "TRIGGER", label: "CPC Spike", config: {} },
      { id: "action-1", type: "ACTION", label: "Cut Budget", config: {} },
    ]
    
    // Cycle setup (action loops back to trigger)
    const edges: WorkflowEdge[] = [
      { id: "edge-1", source: "trigger-1", target: "action-1" },
      { id: "edge-2", source: "action-1", target: "trigger-1" },
    ]

    const errors = WorkflowValidator.validate(nodes, edges)
    expect(errors.some((e) => e.type === "INVALID_TRIGGER_CONNECTION" || e.type === "CYCLIC_DEPENDENCY")).toBe(true)
  })

  it("should detect duplicate connections", () => {
    const nodes: WorkflowNode[] = [
      { id: "trigger-1", type: "TRIGGER", label: "CPC Spike", config: {} },
      { id: "action-1", type: "ACTION", label: "Cut Budget", config: {} },
    ]
    const edges: WorkflowEdge[] = [
      { id: "edge-1", source: "trigger-1", target: "action-1" },
      { id: "edge-2", source: "trigger-1", target: "action-1" },
    ]

    const errors = WorkflowValidator.validate(nodes, edges)
    expect(errors.some((e) => e.type === "DUPLICATE_EDGE")).toBe(true)
  })
})
