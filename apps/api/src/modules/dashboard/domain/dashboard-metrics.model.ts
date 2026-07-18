export interface DashboardMetrics {
  totalLibraryItemsCount: number
  totalClickableImagesCount: number
  totalLandingPagesCount: number
  totalDownloadedVideosCount: number
  timestamp: Date
  futureReadyFields?: Record<string, any> // Extendable for extra metrics later
}
