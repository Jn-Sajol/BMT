import { Injectable, NotFoundException } from "@nestjs/common"
import { MasterPostRepository } from "../../infrastructure/master-post.repository"
import { MasterPost } from "../../domain/master-post.model"
import { PostAsset } from "../../domain/post-asset.model"
import { PostTarget } from "../../domain/post-target.model"

@Injectable()
export class MasterPostService {
  constructor(private readonly masterPostRepository: MasterPostRepository) {}

  public async getPosts(): Promise<MasterPost[]> {
    return this.masterPostRepository.findAll()
  }

  public async createPost(
    title: string,
    description: string,
    assets: PostAsset[],
    targets: PostTarget[],
    ctaLink?: string,
    pinCommentText?: string
  ): Promise<MasterPost> {
    const post: MasterPost = {
      id: `post-${Date.now()}`,
      title,
      description,
      assets,
      targets,
      status: "Draft",
      ctaLink,
      pinCommentText,
      createdAt: new Date(),
    }
    return this.masterPostRepository.save(post)
  }

  public async getPostById(id: string): Promise<MasterPost> {
    const post = await this.masterPostRepository.findById(id)
    if (!post) {
      throw new NotFoundException("Master Post not found.")
    }
    return post
  }

  public async updatePost(id: string, updates: Partial<MasterPost>): Promise<MasterPost> {
    const post = await this.getPostById(id)
    Object.assign(post, updates)
    return this.masterPostRepository.save(post)
  }

  public async deletePost(id: string): Promise<void> {
    await this.masterPostRepository.remove(id)
  }

  public async duplicatePost(id: string): Promise<MasterPost> {
    const original = await this.getPostById(id)
    const duplicate: MasterPost = {
      ...original,
      id: `post-${Date.now()}-dup`,
      title: `${original.title} (Copy)`,
      status: "Draft",
      createdAt: new Date(),
    }
    return this.masterPostRepository.save(duplicate)
  }
}
