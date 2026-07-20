import { Injectable } from "@nestjs/common"
import { YouTubeChannel } from "../domain/youtube.model"

@Injectable()
export class YouTubeChannelRepository {
  private channels: YouTubeChannel[] = []

  public async save(channel: YouTubeChannel): Promise<YouTubeChannel> {
    const idx = this.channels.findIndex((c) => c.id === channel.id)
    if (idx >= 0) {
      this.channels[idx] = channel
    } else {
      this.channels.push(channel)
    }
    return channel
  }

  public async saveAll(channels: YouTubeChannel[]): Promise<YouTubeChannel[]> {
    for (const c of channels) {
      await this.save(c)
    }
    return this.channels
  }

  public async findById(id: string): Promise<YouTubeChannel | null> {
    return this.channels.find((c) => c.id === id) || null
  }

  public async findAll(): Promise<YouTubeChannel[]> {
    return this.channels
  }
}
