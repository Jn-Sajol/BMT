import { BrowserProfileRepository } from "../browser-runtime/infrastructure/browser-profile.repository"
import { BrowserSessionRepository } from "../browser-runtime/infrastructure/browser-session.repository"
import { BrowserContextRepository } from "../browser-runtime/infrastructure/browser-context.repository"
import { BrowserProfileService } from "../browser-runtime/application/services/browser-profile.service"
import { BrowserSessionService } from "../browser-runtime/application/services/browser-session.service"
import { BrowserContextService } from "../browser-runtime/application/services/browser-context.service"
import { BrowserPoolService } from "../browser-runtime/application/services/browser-pool.service"
import { StorageService } from "../browser-runtime/application/services/storage.service"
import { HealthMonitorService } from "../browser-runtime/application/services/health-monitor.service"
import { BrowserRuntimeController } from "../browser-runtime/presentation/browser-runtime.controller"
import { BrowserProfile } from "../browser-runtime/domain/browser-profile.model"

describe("Browser Pool & Runtime (F-39) Unit Tests", () => {
  let profileRepo: BrowserProfileRepository
  let sessionRepo: BrowserSessionRepository
  let contextRepo: BrowserContextRepository

  let profileService: BrowserProfileService
  let sessionService: BrowserSessionService
  let contextService: BrowserContextService
  let poolService: BrowserPoolService
  let storageService: StorageService
  let healthMonitor: HealthMonitorService

  let controller: BrowserRuntimeController

  beforeEach(() => {
    profileRepo = new BrowserProfileRepository()
    sessionRepo = new BrowserSessionRepository()
    contextRepo = new BrowserContextRepository()

    profileService = new BrowserProfileService(profileRepo)
    sessionService = new BrowserSessionService(sessionRepo)
    contextService = new BrowserContextService(contextRepo)
    poolService = new BrowserPoolService()
    storageService = new StorageService()
    healthMonitor = new HealthMonitorService()

    controller = new BrowserRuntimeController(profileService, sessionService, contextService, poolService, storageService)
  })

  it("should test the browser pool allocation, cookies secure encryption, and telemetric health monitor parameters", async () => {
    // 1. Storage Manager - Cookies Encryption
    const raw = '{"session":"123","user":"operator"}'
    const encrypted = await storageService.encryptCookieData(raw)
    expect(encrypted).toContain("enc-aes-256:")

    const decrypted = await storageService.decryptCookieData(encrypted)
    expect(decrypted).toBe(raw)

    // 2. Browser Pool Lifecycle
    const instance = await poolService.startBrowser("prof-100")
    expect(instance.profileId).toBe("prof-100")
    expect(instance.status).toBe("Active")

    // Retrieve active list
    const list = await poolService.getPoolStatus()
    expect(list.length).toBe(1)

    // Release/Stop browser
    await poolService.stopBrowser(instance.id)
    expect(await poolService.getPoolStatus()).toHaveLength(0)

    // 3. Health Monitoring & Crash recovery
    const inst2 = await poolService.startBrowser("prof-200")
    const health = await healthMonitor.inspectInstance(inst2)
    expect(health.recommendation).toBe("KeepRunning")

    // Crash it manually
    inst2.status = "Crashed"
    const healthCrashed = await healthMonitor.inspectInstance(inst2)
    expect(healthCrashed.recommendation).toBe("RestartRequired")

    // Trigger recovery
    const recovered = await poolService.triggerCrashRecovery(inst2.id)
    expect(recovered.status).toBe("Active")
  })
})
