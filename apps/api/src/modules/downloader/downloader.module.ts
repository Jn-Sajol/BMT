import { Module } from "@nestjs/common"
import { DownloaderController } from "./presentation/downloader.controller"
import { DownloaderService } from "./application/services/downloader.service"
import { DownloaderRepository } from "./infrastructure/downloader.repository"

@Module({
  controllers: [DownloaderController],
  providers: [DownloaderService, DownloaderRepository],
  exports: [DownloaderService, DownloaderRepository],
})
export class DownloaderModule {}
