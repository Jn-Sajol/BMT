import { InstagramPost } from "./instagram.model"

export interface IInstagramPublishStrategy {
  publishPost(post: InstagramPost): Promise<string>
}

export class SafeInstagramPublishStrategy implements IInstagramPublishStrategy {
  public async publishPost(post: InstagramPost): Promise<string> {
    console.log(`[SafeInstagramPublishStrategy] Publishing post to Instagram via official Graph Content Publishing API for post id: ${post.id}...`)
    return `ig-pub-${Date.now()}`
  }
}

export class AdvancedInstagramPublishStrategy implements IInstagramPublishStrategy {
  public async publishPost(post: InstagramPost): Promise<string> {
    console.log(`[AdvancedInstagramPublishStrategy] Posting post to Instagram via automated stealth Playwright workers...`)
    return `ig-playwright-pub-${Date.now()}`
  }
}
