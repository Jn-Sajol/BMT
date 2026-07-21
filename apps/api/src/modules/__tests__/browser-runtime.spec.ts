import { BrowserProfileRepository } from "../browser-runtime/infrastructure/browser-profile.repository"
import { BrowserSessionRepository } from "../browser-runtime/infrastructure/browser-session.repository"
import { BrowserContextRepository } from "../browser-runtime/infrastructure/browser-context.repository"
import { BrowserProfileService } from "../browser-runtime/application/services/browser-profile.service"
import { BrowserSessionService } from "../browser-runtime/application/services/browser-session.service"
import { BrowserContextService } from "../browser-runtime/application/services/browser-context.service"
import { BrowserRuntimeController } from "../browser-runtime/presentation/browser-runtime.controller"
import { BrowserProfile } from "../browser-runtime/domain/browser-profile.model"

describe("Browser Runtime Foundation (F-38) Unit Tests", () => {
  let profileRepo: BrowserProfileRepository
  let sessionRepo: BrowserSessionRepository
  let contextRepo: BrowserContextRepository

  let profileService: BrowserProfileService
  let sessionService: BrowserSessionService
  let contextService: BrowserContextService

  let controller: BrowserRuntimeController

  beforeEach(() => {
    profileRepo = new BrowserProfileRepository()
    sessionRepo = new BrowserSessionRepository()
    contextRepo = new BrowserContextRepository()

    profileService = new BrowserProfileService(profileRepo)
    sessionService = new BrowserSessionService(sessionRepo)
    contextService = new BrowserContextService(contextRepo)

    controller = new BrowserRuntimeController(profileService, sessionService, contextService)
  })

  it("should create profile configurations, update session states, validate profiles status, prepare user context configurations, and test controller calls", async () => {
    // 1. Create Profile
    const profile: BrowserProfile = {
      id: "p-202",
      workspaceId: "ws-200",
      userId: "user-200",
      browserEngine: "Chromium",
      profileName: "Chrome posting session profile",
      storageLocation: "s3://bmt/p-202",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const created = await profileService.createProfile(profile)
    expect(created.id).toBe("p-202")

    // 2. Load Profiles
    const loaded = await profileService.loadProfile("p-202")
    expect(loaded).toBeDefined()
    expect(loaded?.profileName).toBe("Chrome posting session profile")

    // 3. Archive Profile
    const archived = await profileService.archiveProfile("p-202")
    expect(archived.status).toBe("Archived")

    // 4. Session Validation
    const sessions = await sessionService.loadMockSessions()
    expect(sessions.length).toBe(1)
    const valid = await sessionService.validateSession(sessions[0].id)
    expect(valid).toBe(true)

    // Expire session
    await sessionService.expireSession(sessions[0].id)
    const validAfter = await sessionService.validateSession(sessions[0].id)
    expect(validAfter).toBe(false)

    // 5. Prepare context details
    const context = await contextService.prepareContext("p-202")
    expect(context.locale).toBe("en-US")
    expect(context.timezone).toBe("America/New_York")

    // Test controller calls
    const profilesList = await controller.getProfiles()
    expect(profilesList.length).toBe(1)
  })
})
