import { YouTubeChannelRepository } from "../youtube/infrastructure/youtube-channel.repository"
import { YouTubeVideoRepository } from "../youtube/infrastructure/youtube-video.repository"
import { YouTubeChannelService } from "../youtube/application/services/youtube-channel.service"
import { YouTubeVideoService } from "../youtube/application/services/youtube-video.service"
import { YouTubeController } from "../youtube/presentation/youtube.controller"

describe("YouTube Marketing (F-36) Unit Tests", () => {
  it("should link channels, schedule video publications, and parse reports and statistics", async () => {
    const channelRepo = new YouTubeChannelRepository()
    const videoRepo = new YouTubeVideoRepository()

    const channelService = new YouTubeChannelService(channelRepo)
    const videoService = new YouTubeVideoService(videoRepo)

    const controller = new YouTubeController(channelService, videoService)

    // 1. Sync mock channels
    const channels = await channelService.loadMockChannels()
    expect(channels.length).toBe(1)
    expect(channels[0].title).toBe("BMT Marketing Agency Tutorials")

    // 2. Mapped link channels OAuth trigger
    const linked = await controller.linkChannel("UC_channel_200", "Cooking channel BMT", "google-token-200")
    expect(linked.channelId).toBe("UC_channel_200")

    // 3. Schedule YouTube video upload
    const video = await controller.scheduleVideo(linked.id, "https://bmt-cdn.s3.amazonaws.com/videos/tutorial.mp4", "New Agency Recipe", "Check the latest culinary strategies.", "Video", undefined)
    expect(video.publishedVideoId).toBeDefined()
    expect(video.status).toBe("Published")

    // 4. Compute reports and analytics
    const dashboard = await controller.getDashboard()
    expect(dashboard.totalChannels).toBe(2)
    expect(dashboard.publishedVideos).toBe(1)
  })
})
