import { Injectable } from "@nestjs/common"

export type CommentJobState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

export interface CommentStateTransitionLog {
  jobId: string
  fromState: CommentJobState
  toState: CommentJobState
  timestamp: Date
  notes?: string
}

@Injectable()
export class CommentStateMachine {
  private auditLogs: CommentStateTransitionLog[] = []
  private states = new Map<string, CommentJobState>()

  public async transition(jobId: string, toState: CommentJobState, notes?: string): Promise<void> {
    const fromState = this.states.get(jobId) || "Created"
    this.states.set(jobId, toState)

    const log: CommentStateTransitionLog = {
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      notes
    }
    this.auditLogs.push(log)
    console.log(`[CommentStateMachine] Job ${jobId} transitioned: ${fromState} ➔ ${toState} (${notes || "No details"})`)
  }

  public getJobState(jobId: string): CommentJobState {
    return this.states.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string): CommentStateTransitionLog[] {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
