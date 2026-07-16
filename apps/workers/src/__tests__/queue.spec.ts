import { processWorkflowJob } from "../queue/job-processor"

// Mock the WorkflowRunner from automation-nodes
jest.mock("automation-nodes", () => ({
  WorkflowRunner: {
    execute: jest.fn().mockResolvedValue({
      status: "COMPLETED",
      nodeOutputs: { "node-1": { success: true } },
      logs: ["Workflow executed successfully."],
    }),
  },
}))

describe("Workers Infrastructure & Job Processor", () => {
  it("should process valid workflow execution payloads successfully", async () => {
    const mockJob: any = {
      id: "job-100",
      data: {
        workflowId: "wf-1",
        executionId: "exec-1",
        nodes: [
          { id: "node-1", type: "webhook-trigger", properties: {} },
        ],
        edges: [],
        variables: {},
      },
    }

    const result = await processWorkflowJob(mockJob)
    expect(result.status).toBe("COMPLETED")
    expect(result.nodeOutputs["node-1"].success).toBe(true)
  })

  it("should fail job processing if execution parameters are missing", async () => {
    const invalidJob: any = {
      id: "job-101",
      data: {},
    }

    await expect(processWorkflowJob(invalidJob)).rejects.toThrow("Missing parameters")
  })
})
