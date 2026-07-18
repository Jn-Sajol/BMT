import { Injectable } from "@nestjs/common"
import { DownloadedFile } from "../domain/downloader.model"

@Injectable()
export class DownloaderRepository {
  private files: DownloadedFile[] = []

  public async save(file: DownloadedFile): Promise<DownloadedFile> {
    this.files.push(file)
    return file
  }

  public async findAll(): Promise<DownloadedFile[]> {
    return this.files
  }
}
