import { Injectable } from "@nestjs/common"
import { MasterPost } from "../domain/master-post.model"

@Injectable()
export class MasterPostRepository {
  private posts: MasterPost[] = []

  public async save(post: MasterPost): Promise<MasterPost> {
    const idx = this.posts.findIndex((p) => p.id === post.id)
    if (idx >= 0) {
      this.posts[idx] = post
    } else {
      this.posts.push(post)
    }
    return post
  }

  public async findById(id: string): Promise<MasterPost | null> {
    return this.posts.find((p) => p.id === id) || null
  }

  public async findAll(): Promise<MasterPost[]> {
    return this.posts
  }

  public async remove(id: string): Promise<void> {
    this.posts = this.posts.filter((p) => p.id !== id)
  }
}
