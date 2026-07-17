export interface Approval {
  id: string
  reviewId: string
  userId: string
  role: "DEVELOPER" | "REVIEWER" | "MANAGER" | "ADMIN"
  action: "APPROVE" | "REJECT" | "REQUEST_CHANGES"
  timestamp: string
  comment: string
  correlationId: string
}
