export type LibraryAssetType = "image" | "video" | "text"

export interface LibraryItem {
  id: string
  name: string
  type: LibraryAssetType
  category: string
  sizeBytes?: number
  url?: string
  content?: string // for text assets
  createdAt: Date
}
