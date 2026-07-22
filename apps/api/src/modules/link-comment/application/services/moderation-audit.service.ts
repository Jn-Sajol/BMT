import { Injectable } from "@nestjs/common"

export interface ModerationAuditLog {
  id: string
  workspaceId: string
  accountId: string
  pageId: string
  postId: string
  commentId: string
  detectedUrls: string[]
  detectionTime: Date
  deleteTime?: Date
  result: "Deleted" | "Allowed" | "Failed" | "Retrying"
  failureReason?: string
}

@Injectable()
export class ModerationAuditService {
  private auditLogs: ModerationAuditLog[] = []

  public recordAudit(log: ModerationAuditLog): ModerationAuditLog {
    this.auditLogs.push(log)
    return log
  }

  public getLogsByWorkspace(workspaceId: string): ModerationAuditLog[] {
    return this.auditLogs.filter((l) => l.workspaceId === workspaceId)
  }

  public getRecentLogs(limit: number = 20): ModerationAuditLog[] {
    return [...this.auditLogs].reverse().slice(0, limit)
  }
}
