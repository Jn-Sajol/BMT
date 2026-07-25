import { Injectable } from "@nestjs/common"

export type GroupMessageVerificationStatus = "QUEUED" | "SCHEDULED" | "SENT" | "FAILED" | "SKIPPED"

export interface GroupMessageVerificationRecord {
  campaignId: string
  groupId: string
  status: GroupMessageVerificationStatus
  isRetryEligible: boolean
  failureReason?: string
  verifiedAt: Date
}

@Injectable()
export class MessengerGroupVerificationService {
  private verificationStore: Map<string, GroupMessageVerificationRecord> = new Map()

  public verifyGroupMessage(
    campaignId: string,
    groupId: string,
    status: GroupMessageVerificationStatus,
    failureReason?: string
  ): GroupMessageVerificationRecord {
    // Retry eligibility rule: retryable if FAILED and not a policy violation or blocked group
    const isRetryEligible = status === "FAILED" && !failureReason?.toLowerCase().includes("blocked") && !failureReason?.toLowerCase().includes("daily limit")

    const record: GroupMessageVerificationRecord = {
      campaignId,
      groupId,
      status,
      isRetryEligible,
      failureReason,
      verifiedAt: new Date()
    }

    this.verificationStore.set(`${campaignId}:${groupId}`, record)
    return record
  }

  public getVerificationRecord(campaignId: string, groupId: string): GroupMessageVerificationRecord | null {
    return this.verificationStore.get(`${campaignId}:${groupId}`) || null
  }
}
