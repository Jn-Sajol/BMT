import { Module } from "@nestjs/common"
import { BrowserRuntimeController } from "./presentation/browser-runtime.controller"
import { BrowserProfileService } from "./application/services/browser-profile.service"
import { BrowserSessionService } from "./application/services/browser-session.service"
import { BrowserContextService } from "./application/services/browser-context.service"
import { BrowserProfileRepository } from "./infrastructure/browser-profile.repository"
import { BrowserSessionRepository } from "./infrastructure/browser-session.repository"
import { BrowserContextRepository } from "./infrastructure/browser-context.repository"

@Module({
  controllers: [BrowserRuntimeController],
  providers: [
    BrowserProfileService,
    BrowserSessionService,
    BrowserContextService,
    BrowserProfileRepository,
    BrowserSessionRepository,
    BrowserContextRepository,
  ],
  exports: [
    BrowserProfileService,
    BrowserSessionService,
    BrowserContextService,
    BrowserProfileRepository,
    BrowserSessionRepository,
    BrowserContextRepository,
  ],
})
export class BrowserRuntimeModule {}
