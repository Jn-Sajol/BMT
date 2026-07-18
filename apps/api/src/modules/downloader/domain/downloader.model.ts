export interface DownloadedFile {
  id: string
  url: string
  platform: "youtube" | "facebook" | "tiktok"
  localFilePath: string
  fileSize: number
  downloadedAt: Date
}
