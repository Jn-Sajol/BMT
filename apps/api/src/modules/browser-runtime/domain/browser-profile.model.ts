export interface BrowserProfile {
  id: string
  workspaceId: string
  userId: string
  browserEngine: "Chromium" | "Firefox" | "Webkit"
  profileName: string
  storageLocation: string // e.g. S3 bucket URI path
  status: "Active" | "Archived" | "Locked"
  lastUsedAt?: Date
  createdAt: Date
  updatedAt: Date
}
