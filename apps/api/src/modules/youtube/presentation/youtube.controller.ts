import { Controller, Get, Post, Param, Body } from "@nestjs/common"
import { YouTubeChannelService } from "../application/services/youtube-channel.service"
import { YouTubeVideoService } from "../application/services/youtube-video.service"
import { YouTubeVideoType } from "../domain/youtube.model"

@Controller("youtube")
export class YouTubeController {
  constructor(
    private readonly youtubeChannelService: YouTubeChannelService,
    private readonly youtubeVideoService: YouTubeVideoService
  ) {}

  @Get("dashboard")
  public async getDashboard() {
    const list = await this.youtubeChannelService.getChannels()
    const videos = await this.youtubeVideoService.getVideos()
    return {
      totalChannels: list.length,
      scheduledVideos: videos.filter((v) => v.status === "Scheduled").length,
      publishedVideos: videos.filter((v) => v.status === "Published").length,
      totalSubscribers: list.reduce((acc, curr) => acc + curr.subscriberCount, 0),
      totalViews: list.reduce((acc, curr) => acc + curr.viewCount, 0),
    }
  }

  @Get("channels")
  public async getChannels() {
    return this.youtubeChannelService.getChannels()
  }

  @Post("channels/link")
  public async linkChannel(
    @Body("channelId") channelId: string,
    @Body("title") title: string,
    @Body("accessToken") accessToken: string
  ) {
    return this.youtubeChannelService.linkChannel(channelId, title, accessToken)
  }

  @Get("videos")
  public async getVideos() {
    return this.youtubeVideoService.getVideos()
  }

  @Post("videos/schedule")
  public async scheduleVideo(
    @Body("channelId") channelId: string,
    @Body("videoUrl") videoUrl: string,
    @Body("title") title: string,
    @Body("description") description: string,
    @Body("type") type: YouTubeVideoType,
    @Body("scheduledFor") scheduledFor?: string
  ) {
    const parsedDate = scheduledFor ? new Date(scheduledFor) : undefined
    return this.youtubeVideoService.scheduleVideo(channelId, videoUrl, title, description, type, parsedDate)
  }

  @Get("reports")
  public async getReports() {
    const list = await this.youtubeChannelService.getChannels()
    const videos = await this.youtubeVideoService.getVideos()
    return list.map((c) => ({
      id: `yt-rep-${c.id}`,
      channelId: c.id,
      totalVideos: videos.filter((v) => v.channelId === c.id).length,
      totalViews: c.viewCount,
      watchTimeHours: 12400,
      subscriberGrowth: 340,
    }))
  }

  @Get("statistics")
  public async getStatistics() {
    const list = await this.youtubeChannelService.getChannels()
    return {
      totalSubscribers: list.reduce((acc, curr) => acc + curr.subscriberCount, 0),
      totalViews: list.reduce((acc, curr) => acc + curr.viewCount, 0),
    }
  }
}
