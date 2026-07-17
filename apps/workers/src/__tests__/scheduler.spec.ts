import { TriggerRegistry } from "automation-nodes"
import { CronScheduler } from "../scheduler/cron-scheduler"

// Mock BullMQ Queue and Redis
jest.mock("bullmq", () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: "job-123" }),
  })),
}))

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  }))
})

describe("Workflow Trigger & Scheduler Engine", () => {
  beforeEach(() => {
    TriggerRegistry.clear()
  })

  it("should register custom trigger definitions in TriggerRegistry", () => {
    TriggerRegistry.register({
      id: "meta-cron-1",
      name: "Hourly Meta Sync",
      type: "cron",
    })

    const trigger = TriggerRegistry.get("meta-cron-1")
    expect(trigger).toBeDefined()
    expect(trigger?.type).toBe("cron")
  })

  it("should calculate correct timezone delay offsets and schedule jobs", async () => {
    const scheduler = new CronScheduler()
    const res = await scheduler.scheduleCronTrigger(
      "wf-99",
      "tr-1",
      "0 * * * *",
      "Asia/Dhaka",
      [],
      []
    )

    expect(res.delayMs).toBeGreaterThanOrEqual(0)
    expect(res.jobName).toBe("cron-wf-99-tr-1")
  })
})
