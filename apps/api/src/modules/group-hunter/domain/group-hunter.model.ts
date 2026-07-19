export type GroupHunterStatus = "Draft" | "Active" | "Archived"

export interface DiscoveredGroup {
  id: string
  groupId: string
  name: string
  description: string
  memberCount: number
  privacy: "Public" | "Closed" | "Secret"
  language: string
  country: string
  tags: string[]
  notes?: string
}

export interface SavedGroup {
  id: string
  discoveredGroup: DiscoveredGroup
  collectionId?: string
  isFavorite: boolean
  savedAt: Date
}

export interface GroupCollection {
  id: string
  name: string
  isFavorite: boolean
  createdAt: Date
}

export interface SearchHistory {
  id: string
  keyword: string
  country: string
  language: string
  timestamp: Date
}

export interface GroupHunterProject {
  id: string
  name: string
  status: GroupHunterStatus
  createdAt: Date
}

export interface GroupHunterSettings {
  maxDailySearches: number
}
