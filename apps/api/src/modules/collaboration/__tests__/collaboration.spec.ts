import { CommentService } from "../application/services/comment.service"
import { ReviewService } from "../application/services/review.service"
import { ApprovalService } from "../application/services/approval.service"
import { PresenceService } from "../application/services/presence.service"
import { ForbiddenException } from "@nestjs/common"

describe("Enterprise Collaboration & Approval Workflow", () => {
  let commentService: CommentService
  let reviewService: ReviewService
  let approvalService: ApprovalService
  let presenceService: PresenceService

  beforeEach(() => {
    commentService = new CommentService()
    reviewService = new ReviewService()
    approvalService = new ApprovalService(reviewService)
    presenceService = new PresenceService()
  })

  it("should create node and workflow comments with replies", () => {
    const parent = commentService.addComment("wf-1", "node-1", "alice", "Please verify this", null)
    const reply = commentService.addComment("wf-1", "node-1", "bob", "Looks fine", parent.id)

    expect(parent.id).toBe("comm-wf-1-1")
    expect(reply.parentCommentId).toBe(parent.id)
    expect(commentService.getComments("wf-1").length).toBe(2)
  })

  it("should change review status to APPROVED upon reviewer action", () => {
    const review = reviewService.submitForReview("wf-1", "dev-10", ["reviewer-1"])
    expect(review.status).toBe("SUBMITTED")

    const approval = approvalService.recordApproval(
      review.id,
      "wf-1",
      "reviewer-1",
      "REVIEWER",
      "APPROVE",
      "LGTM"
    )

    expect(approval.role).toBe("REVIEWER")
    expect(reviewService.getReview("wf-1")?.status).toBe("APPROVED")
  })

  it("should reject approval actions submitted by invalid RBAC roles", () => {
    const review = reviewService.submitForReview("wf-1", "dev-10", ["reviewer-1"])
    expect(() => {
      approvalService.recordApproval(
        review.id,
        "wf-1",
        "dev-10",
        "DEVELOPER",
        "APPROVE",
        "Override approve attempt"
      )
    }).toThrow(ForbiddenException)
  })

  it("should track user presences and verify active editor logs", () => {
    presenceService.setPresence("user-1", "wf-1", "EDITING")
    presenceService.setPresence("user-2", "wf-1", "REVIEWING")

    const list = presenceService.getActivePresences("wf-1")
    expect(list.length).toBe(2)
    expect(list.map((p) => p.userId)).toContain("user-1")
  })
})
