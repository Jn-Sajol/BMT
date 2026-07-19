export interface FacebookGroup {
  id: string
  groupId: string
  name: string
  memberCount: number
  privacy: "OPEN" | "CLOSED"
  accountId: string // linked Facebook profile ID
  createdAt: Date
}
