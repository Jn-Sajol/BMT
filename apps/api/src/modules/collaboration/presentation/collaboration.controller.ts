import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common"
import { CommentService } from "../application/services/comment.service"
import { ReviewService } from "../application/services/review.service"
import { ApprovalService } from "../application/services/approval.service"
import { PresenceService } from "../application/services/presence.service"

@Controller("collaboration")
export class CollaborationController {
  constructor(
    private readonly commentService: CommentService,
    private readonly reviewService: ReviewService,
    private readonly approvalService: ApprovalService,
    private readonly presenceService: PresenceService
  ) {}

  @Post("comments")
  addComment(
    @Body("workflowId") workflowId: string,
    @Body("nodeId") nodeId: string | null,
    @Body("author") author: string,
    @Body("content") content: string,
    @Body("parentCommentId") parentCommentId: string | null
  ) {
    return this.commentService.addComment(workflowId, nodeId, author, content, parentCommentId)
  }

  @Get("comments/:workflowId")
  getComments(@Param("workflowId") workflowId: string) {
    return this.commentService.getComments(workflowId)
  }

  @Post("reviews/submit")
  submitForReview(
    @Body("workflowId") workflowId: string,
    @Body("userId") userId: string,
    @Body("reviewers") reviewers: string[]
  ) {
    return this.reviewService.submitForReview(workflowId, userId, reviewers)
  }

  @Post("reviews/:id/approve")
  approveReview(
    @Param("id") reviewId: string,
    @Body("workflowId") workflowId: string,
    @Body("userId") userId: string,
    @Body("role") role: "DEVELOPER" | "REVIEWER" | "MANAGER" | "ADMIN",
    @Body("comment") comment: string
  ) {
    return this.approvalService.recordApproval(reviewId, workflowId, userId, role, "APPROVE", comment)
  }

  @Post("reviews/:id/reject")
  rejectReview(
    @Param("id") reviewId: string,
    @Body("workflowId") workflowId: string,
    @Body("userId") userId: string,
    @Body("role") role: "DEVELOPER" | "REVIEWER" | "MANAGER" | "ADMIN",
    @Body("comment") comment: string
  ) {
    return this.approvalService.recordApproval(reviewId, workflowId, userId, role, "REJECT", comment)
  }

  @Post("presence")
  @HttpCode(HttpStatus.OK)
  setPresence(
    @Body("userId") userId: string,
    @Body("workflowId") workflowId: string,
    @Body("action") action: "EDITING" | "REVIEWING" | "IDLE"
  ) {
    this.presenceService.setPresence(userId, workflowId, action)
    return { success: true }
  }

  @Get("presence/:workflowId")
  getPresence(@Param("workflowId") workflowId: string) {
    return this.presenceService.getActivePresences(workflowId)
  }
}
