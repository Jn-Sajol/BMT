import { Injectable } from "@nestjs/common"
import { DownloaderRepository } from "../../infrastructure/downloader.repository"
import { DownloadedFile } from "../../domain/downloader.model"

@Injectable()
export class DownloaderService {
  constructor(private readonly downloaderRepository: DownloaderRepository) {}

  public async getDownloadedFiles(): Promise<DownloadedFile[]> {
    return this.downloaderRepository.findAll()
  }

  public async downloadVideo(
    url: string,
    platform: "youtube" | "facebook" | "tiktok"
  ): Promise<DownloadedFile> {
    console.log(`[DownloaderService] Downloading raw video file from ${url}...`)
    const file: DownloadedFile = {
      id: `dl-${Date.now()}`,
      url,
      platform,
      localFilePath: `/var/tmp/downloads/video-${Date.now()}.mp4`,
      fileSize: 10485760, // Mock 10MB
      downloadedAt: new Date(),
    }
    return this.downloaderRepository.save(file)
  }
}
