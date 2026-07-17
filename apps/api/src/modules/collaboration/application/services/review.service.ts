import { Injectable, ForbiddenException } from "@nestjs/common"
import { Review } from "../../domain/review.model"

@Injectable()
export class ReviewService {
  private reviews = new Map<string, Review>()

  public submitForReview(workflowId: string, userId: string, reviewers: string[]): Review {
    const review: Review = {
      id: `rev-${workflowId}-${Date.now()}`,
      workflowId,
      status: "SUBMITTED",
      submittedBy: userId,
      submittedAt: new Date().toISOString(),
      assignedReviewers: reviewers,
      updatedAt: new Date().toISOString(),
    }
    this.reviews.set(workflowId, review)
    return review
  }

  public startReview(workflowId: string): Review {
    const review = this.reviews.get(workflowId)
    if (!review) {
      throw new Error(`No review submission found for workflow ${workflowId}`)
    }
    review.status = "IN_REVIEW"
    review.updatedAt = new Date().toISOString()
    return review
  }

  public updateStatus(
    workflowId: string,
    status: "APPROVED" | "REJECTED" | "PUBLISHED"
  ): Review {
    const review = this.reviews.get(workflowId)
    if (!review) {
      throw new Error(`No active review found for workflow ${workflowId}`)
    }
    review.status = status
    review.updatedAt = new Date().toISOString()
    return review
  }

  public getReview(workflowId: string): Review | null {
    return this.reviews.get(workflowId) || null
  }
}
