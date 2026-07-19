import { Injectable, NotFoundException } from "@nestjs/common"
import { LinkCommentRepository } from "../../infrastructure/link-comment.repository"
import { CommentHistoryRepository } from "../../infrastructure/comment-history.repository"
import { LinkComment, CommentHistory } from "../../domain/link-comment.model"

@Injectable()
export class LinkCommentService {
  constructor(
    private readonly linkCommentRepository: LinkCommentRepository,
    private readonly commentHistoryRepository: CommentHistoryRepository
  ) {}

  public async getComments(): Promise<LinkComment[]> {
    return this.linkCommentRepository.findAll()
  }

  public async getCommentById(id: string): Promise<LinkComment> {
    const comment = await this.linkCommentRepository.findById(id)
    if (!comment) {
      throw new NotFoundException("Link comment not found.")
    }
    return comment
  }

  public async approveComment(id: string, moderator: string): Promise<LinkComment> {
    const comment = await this.getCommentById(id)
    comment.status = "Approved"
    await this.linkCommentRepository.save(comment)

    await this.commentHistoryRepository.save({
      id: `his-${Date.now()}`,
      commentId: id,
      action: "approve",
      moderator,
      timestamp: new Date(),
    })
    return comment
  }

  public async deleteComment(id: string, moderator: string): Promise<LinkComment> {
    const comment = await this.getCommentById(id)
    comment.status = "Deleted"
    await this.linkCommentRepository.save(comment)

    await this.commentHistoryRepository.save({
      id: `his-${Date.now()}`,
      commentId: id,
      action: "delete",
      moderator,
      timestamp: new Date(),
    })
    return comment
  }

  public async ignoreComment(id: string, moderator: string): Promise<LinkComment> {
    const comment = await this.getCommentById(id)
    comment.status = "Ignored"
    await this.linkCommentRepository.save(comment)

    await this.commentHistoryRepository.save({
      id: `his-${Date.now()}`,
      commentId: id,
      action: "ignore",
      moderator,
      timestamp: new Date(),
    })
    return comment
  }

  public async archiveComment(id: string, moderator: string): Promise<LinkComment> {
    const comment = await this.getCommentById(id)
    comment.status = "Archived"
    await this.linkCommentRepository.save(comment)

    await this.commentHistoryRepository.save({
      id: `his-${Date.now()}`,
      commentId: id,
      action: "archive",
      moderator,
      timestamp: new Date(),
    })
    return comment
  }

  public async getHistory(): Promise<CommentHistory[]> {
    return this.commentHistoryRepository.findAll()
  }

  public async loadMockComments(): Promise<LinkComment[]> {
    const mocks: LinkComment[] = [
      {
        id: "lc-1",
        commentId: "c-100",
        postId: "post-100",
        author: { id: "a-1", name: "Sajol", fbUserId: "fb-1" },
        text: "Check out our SaaS pricing at https://bmt-saas-example.com/pricing",
        detectedLinks: ["https://bmt-saas-example.com/pricing"],
        status: "Pending",
        createdAt: new Date(),
      },
      {
        id: "lc-2",
        commentId: "c-101",
        postId: "post-100",
        author: { id: "a-2", name: "John Doe", fbUserId: "fb-2" },
        text: "Register now at http://malicious-spam-url.ru",
        detectedLinks: ["http://malicious-spam-url.ru"],
        status: "Pending",
        createdAt: new Date(),
      },
    ]
    return this.linkCommentRepository.saveAll(mocks)
  }
}
