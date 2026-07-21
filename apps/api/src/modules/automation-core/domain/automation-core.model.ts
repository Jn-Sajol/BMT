export type AutomationJobStatus = "Created" | "Queued" | "Running" | "Waiting" | "Completed" | "Failed" | "Retry"

export interface AutomationJob {
  id: string
  correlationId: string
  workspaceId: string
  jobType: string
  status: AutomationJobStatus
  payload: Record<string, any>
  retryCount: number
  maxRetries: number
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface HumanBehaviourConfig {
  accountId: string
  timezone: string
  workingHours: {
    startHour: number
    endHour: number
  }
  dailyLimits: Record<string, number>
  minCooldownMinutes: number
  randomDelayRange: {
    minSeconds: number
    maxSeconds: number
  }
}

export interface DistributedLock {
  key: string
  ownerId: string
  expiresAt: Date
}

export interface QueueMessageContract {
  correlationId: string
  tracingId: string
  payload: Record<string, any>
  timestamp: Date
}

export interface ProviderCapability {
  platform: string
  action: string
  isEnabled: boolean
}
