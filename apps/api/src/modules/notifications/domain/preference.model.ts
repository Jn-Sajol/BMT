export interface NotificationPreference {
  userId: string
  workspaceId: string
  channels: {
    inApp: boolean
    email: boolean
    slack: boolean
    webhook: boolean
  }
  events: {
    workflowFailed: boolean
    workflowApproved: boolean
    mention: boolean
    aiSuggestion: boolean
    reviewRequest: boolean
  }
}
