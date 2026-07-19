export interface FriendReport {
  id: string
  totalFriendsCount: number
  pendingRequestsCount: number
  acceptanceRatePercentage: number
  categoryDistribution: Record<string, number>
  removalsCount: number
}
