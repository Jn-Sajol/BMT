export interface FacebookPermission {
  id: string
  name: string
  status: "granted" | "declined"
  accountId: string
}
