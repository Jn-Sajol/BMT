export interface BrowserContextConfig {
  id: string
  profileId: string
  contextState: string // configuration details
  locale: string
  timezone: string
  viewport: {
    width: number
    height: number
  }
  userAgent: string
  fingerprintVersion: string
}
