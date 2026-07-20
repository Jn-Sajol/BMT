import { Injectable } from "@nestjs/common"
import { InstagramPostRepository } from "../../infrastructure/instagram-post.repository"
import { SafeInstagramPublishStrategy } from "../../domain/instagram-strategy.interface"
import { InstagramPost, InstagramPostType } from "../../domain/instagram.model"

@Injectable()
export class InstagramPostService {
  constructor(private readonly instagramPostRepository: InstagramPostRepository) {}

  public async getPosts(): Promise<InstagramPost[]> {
    return this.instagramPostRepository.findAll()
  }

  public async schedulePost(profileId: string, mediaUrl: string, caption: string, type: InstagramPostType, scheduledFor?: Date): Promise<InstagramPost> {
    const post: InstagramPost = {
      id: `ig-post-${Date.now()}`,
      profileId,
      mediaUrl,
      caption,
      type,
      status: scheduledFor ? "Scheduled" : "Published",
      scheduledFor,
      createdAt: new Date(),
    }

    if (!scheduledFor) {
      const strategy = new SafeInstagramPublishStrategy()
      post.publishedPostId = await strategy.publishPost(post)
    }

    return this.instagramPostRepository.save(post)
  }
}
