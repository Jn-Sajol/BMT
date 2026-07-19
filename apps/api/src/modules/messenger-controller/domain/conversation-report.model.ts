export interface ConversationReport {
  id: string
  totalInboxCount: number
  repliesApprovedCount: number
  repliesSentCount: number
  averageResponseTimeSeconds: number
  categoryDistribution: Record<string, number>
}
