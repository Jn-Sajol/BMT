import { Injectable } from "@nestjs/common"
import { YouTubeVideoRepository } from "../../infrastructure/youtube-video.repository"
import { SafeYouTubePublishStrategy } from "../../domain/youtube-strategy.interface"
import { YouTubeVideo, YouTubeVideoType } from "../../domain/youtube.model"

@Injectable()
export class YouTubeVideoService {
  constructor(private readonly youtubeVideoRepository: YouTubeVideoRepository) {}

  public async getVideos(): Promise<YouTubeVideo[]> {
    return this.youtubeVideoRepository.findAll()
  }

  public async scheduleVideo(channelId: string, videoUrl: string, title: string, description: string, type: YouTubeVideoType, scheduledFor?: Date): Promise<YouTubeVideo> {
    const video: YouTubeVideo = {
      id: `yt-vid-${Date.now()}`,
      channelId,
      videoUrl,
      title,
      description,
      type,
      status: scheduledFor ? "Scheduled" : "Published",
      scheduledFor,
      createdAt: new Date(),
    }

    if (!scheduledFor) {
      const strategy = new SafeYouTubePublishStrategy()
      video.publishedVideoId = await strategy.publishVideo(video)
    }

    return this.youtubeVideoRepository.save(video)
  }
}
