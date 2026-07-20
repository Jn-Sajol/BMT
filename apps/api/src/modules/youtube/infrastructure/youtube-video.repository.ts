import { Injectable } from "@nestjs/common"
import { YouTubeVideo } from "../domain/youtube.model"

@Injectable()
export class YouTubeVideoRepository {
  private videos: YouTubeVideo[] = []

  public async save(video: YouTubeVideo): Promise<YouTubeVideo> {
    const idx = this.videos.findIndex((v) => v.id === video.id)
    if (idx >= 0) {
      this.videos[idx] = video
    } else {
      this.videos.push(video)
    }
    return video
  }

  public async findById(id: string): Promise<YouTubeVideo | null> {
    return this.videos.find((v) => v.id === id) || null
  }

  public async findAll(): Promise<YouTubeVideo[]> {
    return this.videos
  }
}
