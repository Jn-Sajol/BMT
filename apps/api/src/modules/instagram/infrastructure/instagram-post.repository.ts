import { Injectable } from "@nestjs/common"
import { InstagramPost } from "../domain/instagram.model"

@Injectable()
export class InstagramPostRepository {
  private posts: InstagramPost[] = []

  public async save(post: InstagramPost): Promise<InstagramPost> {
    const idx = this.posts.findIndex((p) => p.id === post.id)
    if (idx >= 0) {
      this.posts[idx] = post
    } else {
      this.posts.push(post)
    }
    return post
  }

  public async findById(id: string): Promise<InstagramPost | null> {
    return this.posts.find((p) => p.id === id) || null
  }

  public async findAll(): Promise<InstagramPost[]> {
    return this.posts
  }
}
