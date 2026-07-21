import { Injectable } from "@nestjs/common"

export type ReplyJobState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

export interface ReplyStateTransitionLog {
  jobId: string
  fromState: ReplyJobState
  toState: ReplyJobState
  timestamp: Date
  notes?: string
}

@Injectable()
export class ReplyStateMachine {
  private auditLogs: ReplyStateTransitionLog[] = []
  private states = new Map<string, ReplyJobState>()

  public async transition(jobId: string, toState: ReplyJobState, notes?: string): Promise<void> {
    const fromState = this.states.get(jobId) || "Created"
    this.states.set(jobId, toState)

    const log: ReplyStateTransitionLog = {
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      notes
    }
    this.auditLogs.push(log)
    console.log(`[ReplyStateMachine] Job ${jobId} transitioned: ${fromState} ➔ ${toState} (${notes || "No details"})`)
  }

  public getJobState(jobId: string): ReplyJobState {
    return this.states.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string): ReplyStateTransitionLog[] {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
