export type LinkFinderStatus = "Active" | "Archived"

export interface DiscoveredMessengerLink {
  id: string
  groupId: string
  groupName: string
  inviteUrl: string
  memberCount: number
  messageFrequencyDaily: number
  status: "Active" | "Inactive"
  country: string
  language: string
  tags: string[]
  notes?: string
  createdAt: Date
}

export interface SavedMessengerLink {
  id: string
  discoveredLink: DiscoveredMessengerLink
  collectionId?: string
  isFavorite: boolean
  savedAt: Date
}

export interface LinkCollection {
  id: string
  name: string
  createdAt: Date
}

export interface LinkSearchHistory {
  id: string
  keyword: string
  country: string
  language: string
  timestamp: Date
}

export interface LinkFinderSettings {
  maxDailySearches: number
}
