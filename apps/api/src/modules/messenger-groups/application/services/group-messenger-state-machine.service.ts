import { Injectable } from "@nestjs/common"

export type GroupMessengerJobState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

export interface GroupMessengerStateTransitionLog {
  jobId: string
  fromState: GroupMessengerJobState
  toState: GroupMessengerJobState
  timestamp: Date
  notes?: string
}

@Injectable()
export class GroupMessengerStateMachine {
  private auditLogs: GroupMessengerStateTransitionLog[] = []
  private states = new Map<string, GroupMessengerJobState>()

  public async transition(jobId: string, toState: GroupMessengerJobState, notes?: string): Promise<void> {
    const fromState = this.states.get(jobId) || "Created"
    this.states.set(jobId, toState)

    const log: GroupMessengerStateTransitionLog = {
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      notes
    }
    this.auditLogs.push(log)
    console.log(`[GroupMessengerStateMachine] Job ${jobId} transitioned: ${fromState} ➔ ${toState} (${notes || "No details"})`)
  }

  public getJobState(jobId: string): GroupMessengerJobState {
    return this.states.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string): GroupMessengerStateTransitionLog[] {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
