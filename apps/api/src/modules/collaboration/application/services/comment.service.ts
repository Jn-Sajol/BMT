import { Injectable } from "@nestjs/common"
import { Comment } from "../../domain/comment.model"

@Injectable()
export class CommentService {
  private comments = new Map<string, Comment[]>()

  public addComment(
    workflowId: string,
    nodeId: string | null,
    author: string,
    content: string,
    parentCommentId: string | null
  ): Comment {
    const list = this.comments.get(workflowId) || []
    const newComment: Comment = {
      id: `comm-${workflowId}-${list.length + 1}`,
      workflowId,
      nodeId,
      author,
      content,
      createdAt: new Date().toISOString(),
      parentCommentId,
      isResolved: false,
    }

    list.push(newComment)
    this.comments.set(workflowId, list)
    return newComment
  }

  public getComments(workflowId: string): Comment[] {
    return this.comments.get(workflowId) || []
  }

  public resolveThread(workflowId: string, commentId: string): void {
    const list = this.comments.get(workflowId) || []
    const comment = list.find((c) => c.id === commentId)
    if (comment) {
      comment.isResolved = true
    }
  }
}
