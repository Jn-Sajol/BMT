import { Injectable, ForbiddenException } from "@nestjs/common"
import { Approval } from "../../domain/approval.model"
import { ReviewService } from "./review.service"

@Injectable()
export class ApprovalService {
  private approvals: Approval[] = []

  constructor(private readonly reviewService: ReviewService) {}

  public recordApproval(
    reviewId: string,
    workflowId: string,
    userId: string,
    role: "DEVELOPER" | "REVIEWER" | "MANAGER" | "ADMIN",
    action: "APPROVE" | "REJECT" | "REQUEST_CHANGES",
    comment: string
  ): Approval {
    // 1. Enforce RBAC validation
    if (role === "DEVELOPER" && action === "APPROVE") {
      throw new ForbiddenException("DEVELOPER role cannot approve reviews.")
    }

    const approval: Approval = {
      id: `appr-${reviewId}-${this.approvals.length + 1}`,
      reviewId,
      userId,
      role,
      action,
      timestamp: new Date().toISOString(),
      comment,
      correlationId: `corr-appr-${reviewId}-${Date.now()}`,
    }

    this.approvals.push(approval)

    // Update review status accordingly
    if (action === "APPROVE") {
      this.reviewService.updateStatus(workflowId, "APPROVED")
    } else if (action === "REJECT") {
      this.reviewService.updateStatus(workflowId, "REJECTED")
    }

    return approval
  }

  public getApprovalsForReview(reviewId: string): Approval[] {
    return this.approvals.filter((a) => a.reviewId === reviewId)
  }
}
