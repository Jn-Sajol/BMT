export interface BrowserSession {
  id: string
  profileId: string
  sessionState: string // JSON encrypted cookies/localstorage string
  expiresAt: Date
  lastValidatedAt: Date
  status: "Valid" | "Expired" | "Revoked"
}
