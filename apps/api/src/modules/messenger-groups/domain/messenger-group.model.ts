export interface MessengerGroup {
  id: string
  groupId: string
  name: string
  memberCount: number
  status: "Active" | "Archived"
  accountId: string
  createdAt: Date
}
