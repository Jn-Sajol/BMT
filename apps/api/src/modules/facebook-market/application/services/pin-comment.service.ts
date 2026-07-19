import { Injectable } from "@nestjs/common"
import { PinComment } from "../../domain/pin-comment.model"

@Injectable()
export class PinCommentService {
  private comments: PinComment[] = []

  public async registerPinComment(postId: string, content: string): Promise<PinComment> {
    const item: PinComment = {
      id: `pin-${Date.now()}`,
      postId,
      content,
      status: "pending",
      createdAt: new Date(),
    }
    this.comments.push(item)
    return item
  }

  public async publishPinComment(id: string, fbPostId: string): Promise<PinComment> {
    const comment = this.comments.find((c) => c.id === id)
    if (!comment) {
      throw new Error("Pin comment configuration not found.")
    }
    console.log(`[PinCommentService] Publishing CTA comment to Facebook post ${fbPostId}...`)
    comment.status = "published"
    comment.facebookCommentId = `fb-comment-${Date.now()}`
    return comment
  }

  public async getCommentsByPost(postId: string): Promise<PinComment[]> {
    return this.comments.filter((c) => c.postId === postId)
  }
}
