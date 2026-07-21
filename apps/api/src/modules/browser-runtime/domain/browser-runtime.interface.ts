import { BrowserProfile } from "./browser-profile.model"
import { BrowserSession } from "./browser-session.model"
import { BrowserContextConfig } from "./browser-context.model"

export interface IBrowserProfileManager {
  createProfile(profile: BrowserProfile): Promise<BrowserProfile>
  loadProfile(id: string): Promise<BrowserProfile | null>
  archiveProfile(id: string): Promise<BrowserProfile>
  listProfiles(): Promise<BrowserProfile[]>
}

export interface IBrowserSessionManager {
  loadSession(id: string): Promise<BrowserSession | null>
  saveSession(session: BrowserSession): Promise<BrowserSession>
  validateSession(id: string): Promise<boolean>
  expireSession(id: string): Promise<void>
}

export interface IBrowserContextManager {
  prepareContext(profileId: string): Promise<BrowserContextConfig>
  restoreContext(id: string): Promise<BrowserContextConfig>
  disposeContext(id: string): Promise<void>
}

export interface IBrowserRuntime {
  profileManager: IBrowserProfileManager
  sessionManager: IBrowserSessionManager
  contextManager: IBrowserContextManager
}
