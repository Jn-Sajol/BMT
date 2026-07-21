import { Controller, Get, Post, Body, Query, Param, Delete } from "@nestjs/common"
import { BrowserProfileService } from "../application/services/browser-profile.service"
import { BrowserSessionService } from "../application/services/browser-session.service"
import { BrowserContextService } from "../application/services/browser-context.service"
import { BrowserPoolService } from "../application/services/browser-pool.service"
import { StorageService } from "../application/services/storage.service"
import { BrowserProfile } from "../domain/browser-profile.model"

@Controller()
export class BrowserRuntimeController {
  constructor(
    private readonly browserProfileService: BrowserProfileService,
    private readonly browserSessionService: BrowserSessionService,
    private readonly browserContextService: BrowserContextService,
    private readonly browserPoolService: BrowserPoolService,
    private readonly storageService: StorageService
  ) {}

  @Get("browser-runtime/profiles")
  public async getProfiles() {
    return this.browserProfileService.listProfiles()
  }

  @Post("browser-runtime/profiles")
  public async createProfile(
    @Body("workspaceId") workspaceId: string,
    @Body("userId") userId: string,
    @Body("profileName") profileName: string,
    @Body("engine") engine: "Chromium" | "Firefox" | "Webkit"
  ) {
    const profile: BrowserProfile = {
      id: `prof-${Date.now()}`,
      workspaceId,
      userId,
      browserEngine: engine,
      profileName,
      storageLocation: `s3://bmt-profiles-bucket/prof-${Date.now()}`,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.browserProfileService.createProfile(profile)
  }

  @Get("browser-runtime/sessions")
  public async getSessions() {
    return this.browserSessionService.loadMockSessions()
  }

  @Post("browser-runtime/sessions/refresh")
  public async refreshSession(@Body("id") id: string) {
    const success = await this.browserSessionService.validateSession(id)
    return { success }
  }

  @Get("browser-pool")
  public async getPool() {
    return this.browserPoolService.getPoolStatus()
  }

  @Post("browser-pool/start")
  public async startBrowser(@Body("profileId") profileId: string) {
    return this.browserPoolService.startBrowser(profileId)
  }

  @Post("browser-pool/stop")
  public async stopBrowser(@Body("id") id: string) {
    await this.browserPoolService.stopBrowser(id)
    return { success: true }
  }

  @Get("browser-runtime/storage")
  public async getStorage(@Query("profileId") profileId: string) {
    return this.storageService.getStorageMetadata(profileId)
  }
}
