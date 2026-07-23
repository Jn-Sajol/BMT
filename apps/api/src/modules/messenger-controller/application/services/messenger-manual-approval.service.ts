import { Injectable } from "@nestjs/common"

export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Edited"

export interface ManualApprovalRecord {
  id: string
  conversationId: string
  originalMessageText: string
  suggestedReply: string
  finalReply: string
  status: ApprovalStatus
  actionTakenBy: string
  timestamp: Date
}

@Injectable()
export class MessengerManualApprovalService {
  private approvalRecords: Map<string, ManualApprovalRecord> = new Map()

  public createApprovalRecord(
    conversationId: string,
    originalMessageText: string,
    suggestedReply: string
  ): ManualApprovalRecord {
    const record: ManualApprovalRecord = {
      id: `appr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      originalMessageText,
      suggestedReply,
      finalReply: suggestedReply,
      status: "Pending",
      actionTakenBy: "system",
      timestamp: new Date()
    }
    this.approvalRecords.set(record.id, record)
    return record
  }

  public approveSuggestion(recordId: string, approvedBy: string = "user"): ManualApprovalRecord {
    const record = this.getRecord(recordId)
    record.status = "Approved"
    record.actionTakenBy = approvedBy
    return record
  }

  public rejectSuggestion(recordId: string, rejectedBy: string = "user"): ManualApprovalRecord {
    const record = this.getRecord(recordId)
    record.status = "Rejected"
    record.actionTakenBy = rejectedBy
    return record
  }

  public editSuggestion(recordId: string, newReplyText: string, editedBy: string = "user"): ManualApprovalRecord {
    const record = this.getRecord(recordId)
    record.finalReply = newReplyText
    record.status = "Edited"
    record.actionTakenBy = editedBy
    return record
  }

  public replaceWithLibraryMessage(recordId: string, libraryMessage: string, replacedBy: string = "user"): ManualApprovalRecord {
    const record = this.getRecord(recordId)
    record.finalReply = libraryMessage
    record.status = "Edited"
    record.actionTakenBy = replacedBy
    return record
  }

  public getRecord(recordId: string): ManualApprovalRecord {
    const record = this.approvalRecords.get(recordId)
    if (!record) {
      throw new Error(`Approval record ${recordId} not found`)
    }
    return record
  }

  public getPendingApprovals(): ManualApprovalRecord[] {
    return Array.from(this.approvalRecords.values()).filter((r) => r.status === "Pending")
  }
}
