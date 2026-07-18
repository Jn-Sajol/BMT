import { Module } from "@nestjs/common"
import { DashboardController } from "./presentation/dashboard.controller"
import { DashboardService } from "./application/services/dashboard.service"
import { DashboardStatsRepository } from "./infrastructure/dashboard-stats.repository"
import { LibraryModule } from "../library/library.module"
import { ClickableImageModule } from "../clickable-image/clickable-image.module"
import { LandingPageModule } from "../landing-page/landing-page.module"
import { DownloaderModule } from "../downloader/downloader.module"

@Module({
  imports: [
    LibraryModule,
    ClickableImageModule,
    LandingPageModule,
    DownloaderModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardStatsRepository],
})
export class DashboardModule {}
