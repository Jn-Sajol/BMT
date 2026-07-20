import { YouTubeVideo } from "./youtube.model"

export interface IYouTubePublishStrategy {
  publishVideo(video: YouTubeVideo): Promise<string>
}

export class SafeYouTubePublishStrategy implements IYouTubePublishStrategy {
  public async publishVideo(video: YouTubeVideo): Promise<string> {
    console.log(`[SafeYouTubePublishStrategy] Uploading video to YouTube via official Google API OAuth for video id: ${video.id}...`)
    return `yt-vid-${Date.now()}`
  }
}

export class AdvancedYouTubePublishStrategy implements IYouTubePublishStrategy {
  public async publishVideo(video: YouTubeVideo): Promise<string> {
    console.log(`[AdvancedYouTubePublishStrategy] Automating video uploads using Playwright browser emulation...`)
    return `yt-playwright-vid-${Date.now()}`
  }
}
