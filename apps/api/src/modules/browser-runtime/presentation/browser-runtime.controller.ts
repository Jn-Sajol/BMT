import { Controller, Get, Post, Body, Query, Param } from "@nestjs/common"
import { BrowserProfileService } from "../application/services/browser-profile.service"
import { BrowserSessionService } from "../application/services/browser-session.service"
import { BrowserContextService } from "../application/services/browser-context.service"
import { BrowserProfile } from "../domain/browser-profile.model"

@Controller("browser-runtime")
export class BrowserRuntimeController {
  constructor(
    private readonly browserProfileService: BrowserProfileService,
    private readonly browserSessionService: BrowserSessionService,
    private readonly browserContextService: BrowserContextService
  ) {}

  @Get("profiles")
  public async getProfiles() {
    return this.browserProfileService.listProfiles()
  }

  @Post("profiles")
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
      updatedAt: new Date()
    }
    return this.browserProfileService.createProfile(profile)
  }

  @Get("sessions")
  public async validateSession(@Query("id") id: string) {
    const isValid = await this.browserSessionService.validateSession(id)
    return { isValid }
  }

  @Post("context")
  public async prepareContext(@Body("profileId") profileId: string) {
    return this.browserContextService.prepareContext(profileId)
  }
}
