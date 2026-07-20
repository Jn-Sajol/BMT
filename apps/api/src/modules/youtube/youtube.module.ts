import { Module } from "@nestjs/common"
import { YouTubeController } from "./presentation/youtube.controller"
import { YouTubeChannelService } from "./application/services/youtube-channel.service"
import { YouTubeVideoService } from "./application/services/youtube-video.service"
import { YouTubeChannelRepository } from "./infrastructure/youtube-channel.repository"
import { YouTubeVideoRepository } from "./infrastructure/youtube-video.repository"

@Module({
  controllers: [YouTubeController],
  providers: [
    YouTubeChannelService,
    YouTubeVideoService,
    YouTubeChannelRepository,
    YouTubeVideoRepository,
  ],
  exports: [
    YouTubeChannelService,
    YouTubeVideoService,
    YouTubeChannelRepository,
    YouTubeVideoRepository,
  ],
})
export class YouTubeModule {}
