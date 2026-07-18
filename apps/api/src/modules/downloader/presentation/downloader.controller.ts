import { Controller, Post, Body, Get } from "@nestjs/common"
import { DownloaderService } from "../application/services/downloader.service"

@Controller("downloader")
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Get()
  public async listFiles() {
    return this.downloaderService.getDownloadedFiles()
  }

  @Post("download")
  public async download(
    @Body("url") url: string,
    @Body("platform") platform: "youtube" | "facebook" | "tiktok"
  ) {
    return this.downloaderService.downloadVideo(url, platform)
  }
}
