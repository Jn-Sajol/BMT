import { AutomationJob, HumanBehaviourConfig } from "./automation-core.model"

export type VerificationStatusType = "Success" | "Failed" | "Skipped" | "ManualReview" | "Timeout"
export type RetryPolicyType = "Fixed" | "Linear" | "ExponentialBackoff" | "NeverRetry" | "ScheduledRetry"

export interface AutomationContext {
  workspaceId: string
  accountId: string
  browserProfileId?: string
  hbfConfig: HumanBehaviourConfig
  featureFlags: Record<string, boolean>
  dailyBudget: number
  hourlyBudget: number
  accountHealthScore: number
  riskLevel: "Low" | "Medium" | "High"
  queues: string[]
  metadata?: Record<string, any>
}

export interface VerificationResult {
  status: VerificationStatusType
  verifiedAt: Date
  details?: string
  confidenceScore?: number
}

export interface ExecutionResult {
  status: "Success" | "Failed" | "Skipped" | "Retry" | "Waiting"
  durationMs: number
  warnings: string[]
  retryable: boolean
  verificationResult: VerificationResult
  metrics: {
    queueWaitMs: number
    executionDurationMs: number
    verificationDurationMs: number
    pacingDelayMs: number
  }
  auditRef: string
  logs: string[]
}

export interface RetryPolicy {
  type: RetryPolicyType
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

export type FrameworkEventType =
  | "AutomationQueued"
  | "AutomationStarted"
  | "AutomationDelayed"
  | "AutomationPaused"
  | "AutomationRetried"
  | "AutomationSkipped"
  | "AutomationFailed"
  | "AutomationCompleted"
  | "AutomationVerified"

export interface FrameworkEventPayload {
  eventName: FrameworkEventType
  jobId: string
  workspaceId: string
  accountId: string
  timestamp: Date
  details?: Record<string, any>
}
