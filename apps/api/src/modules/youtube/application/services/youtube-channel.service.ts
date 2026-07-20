import { Injectable, NotFoundException } from "@nestjs/common"
import { YouTubeChannelRepository } from "../../infrastructure/youtube-channel.repository"
import { YouTubeChannel } from "../../domain/youtube.model"

@Injectable()
export class YouTubeChannelService {
  constructor(private readonly youtubeChannelRepository: YouTubeChannelRepository) {}

  public async getChannels(): Promise<YouTubeChannel[]> {
    return this.youtubeChannelRepository.findAll()
  }

  public async getChannelById(id: string): Promise<YouTubeChannel> {
    const channel = await this.youtubeChannelRepository.findById(id)
    if (!channel) {
      throw new NotFoundException("YouTube channel profile not found.")
    }
    return channel
  }

  public async linkChannel(channelId: string, title: string, accessToken: string): Promise<YouTubeChannel> {
    const channel: YouTubeChannel = {
      id: `yt-chan-${Date.now()}`,
      channelId,
      title,
      description: "Business marketing channel",
      thumbnailUrl: "https://bmt-cdn-mock.s3.amazonaws.com/channels/yt-thumb.jpg",
      googleAccessToken: accessToken,
      subscriberCount: 82000,
      viewCount: 1450000,
      videoCount: 148,
      createdAt: new Date(),
    }
    return this.youtubeChannelRepository.save(channel)
  }

  public async loadMockChannels(): Promise<YouTubeChannel[]> {
    const mocks: YouTubeChannel[] = [
      {
        id: "yt-chan-1",
        channelId: "UC_mock_channel_100",
        title: "BMT Marketing Agency Tutorials",
        description: "Official BMT agency training materials",
        thumbnailUrl: "https://bmt-cdn-mock.s3.amazonaws.com/channels/yt-thumb-1.jpg",
        googleAccessToken: "mock-google-token-1",
        subscriberCount: 42000,
        viewCount: 350000,
        videoCount: 52,
        createdAt: new Date(),
      },
    ]
    return this.youtubeChannelRepository.saveAll(mocks)
  }
}
