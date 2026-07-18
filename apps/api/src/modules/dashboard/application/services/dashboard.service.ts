import { Injectable } from "@nestjs/common"
import { DashboardStatsRepository } from "../../infrastructure/dashboard-stats.repository"
import { LibraryRepository } from "../../../library/infrastructure/library.repository"
import { ClickableImageRepository } from "../../../clickable-image/infrastructure/clickable-image.repository"
import { LandingPageRepository } from "../../../landing-page/infrastructure/landing-page.repository"
import { DownloaderRepository } from "../../../downloader/infrastructure/downloader.repository"
import { DashboardMetrics } from "../../domain/dashboard-metrics.model"

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardStatsRepository: DashboardStatsRepository,
    private readonly libraryRepository: LibraryRepository,
    private readonly clickableImageRepository: ClickableImageRepository,
    private readonly landingPageRepository: LandingPageRepository,
    private readonly downloaderRepository: DownloaderRepository
  ) {}

  public async getAggregatedMetrics(): Promise<DashboardMetrics> {
    const libraryItems = await this.libraryRepository.findAll()
    const clickableImages = await this.clickableImageRepository.findAll()
    const landingPages = await this.landingPageRepository.findAll()
    const downloads = await this.downloaderRepository.findAll()

    return {
      totalLibraryItemsCount: libraryItems.length,
      totalClickableImagesCount: clickableImages.length,
      totalLandingPagesCount: landingPages.length,
      totalDownloadedVideosCount: downloads.length,
      timestamp: new Date(),
      futureReadyFields: {
        activeAudienceCount: 0,
        activeSchedulesCount: 0,
      },
    }
  }
}
