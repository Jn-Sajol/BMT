import "reflect-metadata"
import { ExecutionMonitorController } from "./execution-monitor.controller"
import { NotFoundException } from "@nestjs/common"

// Mock BullMQ Queue and Redis
jest.mock("bullmq", () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: "job-replay-100" }),
  })),
}))

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  }))
})

describe("ExecutionMonitorController Unit Tests", () => {
  let controller: ExecutionMonitorController

  beforeEach(() => {
    controller = new ExecutionMonitorController()
  });

  it("should fetch execution history listings successfully", () => {
    const res = controller.getExecutionHistory("wf-99", "ws-100")
    expect(res.length).toBe(2)
    expect(res[0].id).toBe("run-101")
  })

  it("should return node-by-node timeline details for run-101", () => {
    const res = controller.getExecutionTimeline("run-101")
    expect(res.length).toBe(2)
    expect(res[0].nodeId).toBe("node-1")
    expect(res[0].status).toBe("SUCCESS")
  })

  it("should return node-by-node timeline details with error codes for failed runs", () => {
    const res = controller.getExecutionTimeline("run-102")
    expect(res[1].status).toBe("FAILED")
    expect(res[1].errorMessage).toBe("OAuth Scope Permission Mismatch")
  })

  it("should throw NotFoundException if execution run does not exist", () => {
    expect(() => {
      controller.getExecutionTimeline("run-999")
    }).toThrow(NotFoundException)
  })

  it("should enqueue a replay job to BullMQ successfully", async () => {
    const res = await controller.replayExecution("run-101")
    expect(res.success).toBe(true)
    expect(res.correlationId).toContain("replay-run-101")
  })
})
