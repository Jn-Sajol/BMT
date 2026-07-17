export interface Review {
  id: string
  workflowId: string
  status: "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED"
  submittedBy: string
  submittedAt: string
  assignedReviewers: string[]
  updatedAt: string
}
