import { AutomationJob } from "./automation-core.model"
import { AutomationContext, ExecutionResult, VerificationResult } from "./automation-framework.model"
import { IExecutionStrategy } from "./automation-strategy.interface"
import { BaseJobCoordinator } from "./base-job-coordinator"

export enum AutomationCapability {
  POST = "POST",
  COMMENT = "COMMENT",
  REPLY = "REPLY",
  MESSAGE = "MESSAGE",
  GROUP_POST = "GROUP_POST",
  GROUP_MESSAGE = "GROUP_MESSAGE",
  FRIEND_REQUEST = "FRIEND_REQUEST",
  UNFRIEND = "UNFRIEND",
  MARKETPLACE_LISTING = "MARKETPLACE_LISTING",
  GROUP_DISCOVERY = "GROUP_DISCOVERY",
  GROUP_AUTO_JOIN = "GROUP_AUTO_JOIN",
  COMMENT_BLOCK_DISCOVERY = "COMMENT_BLOCK_DISCOVERY",
}

export interface PlatformDriver {
  platformId: string // e.g. 'facebook', 'instagram', 'linkedin', 'tiktok', 'telegram'
  platformName: string
  version: string
  initialize(context: AutomationContext): Promise<boolean>
  validatePlatformAuth(accountId: string): Promise<boolean>
}

export type LifecycleHookStage =
  | "BeforePrepare"
  | "BeforeExecute"
  | "AfterExecute"
  | "BeforeVerify"
  | "AfterVerify"
  | "AfterComplete"
  | "OnFailure"

export interface PluginMetadata {
  id: string
  name: string
  version: string
  description: string
  platform: string
}

export interface AutomationPlugin {
  metadata: PluginMetadata
  driver: PlatformDriver
  capabilities: AutomationCapability[]
  executionStrategy: IExecutionStrategy
  jobCoordinator?: BaseJobCoordinator<any>
  isEnabled: boolean
  verify(job: AutomationJob): Promise<VerificationResult>
  report(job: AutomationJob, result: ExecutionResult): Promise<void>
  hooks?: Partial<Record<LifecycleHookStage, Array<(job: AutomationJob, context: AutomationContext) => Promise<void>>>>
}
