export type PostAssetType = "Text" | "Photo" | "Video" | "Reel" | "Story" | "Poll"

export interface PostAsset {
  id: string
  type: PostAssetType
  url?: string
  content?: string
}
