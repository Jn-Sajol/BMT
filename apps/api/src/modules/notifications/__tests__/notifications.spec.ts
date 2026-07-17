import { PreferenceService } from "../application/services/preference.service"
import { TemplateEngine } from "../application/services/template-engine"
import { NotificationDispatcher } from "../application/services/notification-dispatcher"

// Mock BullMQ Queue and Redis
jest.mock("bullmq", () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: "job-delivery-100" }),
  })),
}))

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  }))
})

describe("Centralized Notification & Communication Center", () => {
  let preferenceService: PreferenceService
  let templateEngine: TemplateEngine
  let dispatcher: NotificationDispatcher

  beforeEach(() => {
    preferenceService = new PreferenceService()
    templateEngine = new TemplateEngine()
    dispatcher = new NotificationDispatcher(preferenceService, templateEngine)
    dispatcher.onModuleInit()
  })

  it("should compile reusable templates mapping variables correctly", () => {
    const text = templateEngine.compile("workflow-failed", {
      workflow: "Meta Sync",
      workspace: "Dev WS",
      error: "Timeout",
    })

    expect(text).toBe("Workflow Meta Sync in workspace Dev WS failed with error: Timeout.")
  })

  it("should bypass dispatching if target user event preferences are disabled", async () => {
    const prefs = preferenceService.getPreferences("user-1", "ws-1")
    prefs.events.workflowFailed = false // Disable failing events alerts
    preferenceService.savePreferences("user-1", "ws-1", prefs)

    await dispatcher.dispatchEvent("user-1", "ws-1", "workflowFailed", "workflow-failed", {
      workflow: "Meta Sync",
      workspace: "Dev WS",
      error: "Timeout",
    })

    const list = dispatcher.listNotifications("user-1")
    expect(list.length).toBe(0) // bypassed
  })

  it("should enqueue pending jobs to BullMQ for enabled preferences and update read states", async () => {
    await dispatcher.dispatchEvent("user-2", "ws-1", "workflowApproved", "workflow-approved", {
      workflow: "Meta Sync",
      workspace: "Dev WS",
      user: "alice",
    })

    const list = dispatcher.listNotifications("user-2")
    expect(list.length).toBeGreaterThan(0)
    expect(list[0].isRead).toBe(false)

    // Toggle Read Status
    dispatcher.markAsRead(list[0].id)
    expect(list[0].isRead).toBe(true)
  })
})
