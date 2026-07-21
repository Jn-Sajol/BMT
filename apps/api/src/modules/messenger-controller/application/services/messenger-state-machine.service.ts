import { Injectable } from "@nestjs/common"

export type MessengerJobState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

export interface MessengerStateTransitionLog {
  jobId: string
  fromState: MessengerJobState
  toState: MessengerJobState
  timestamp: Date
  notes?: string
}

@Injectable()
export class MessengerStateMachine {
  private auditLogs: MessengerStateTransitionLog[] = []
  private states = new Map<string, MessengerJobState>()

  public async transition(jobId: string, toState: MessengerJobState, notes?: string): Promise<void> {
    const fromState = this.states.get(jobId) || "Created"
    this.states.set(jobId, toState)

    const log: MessengerStateTransitionLog = {
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      notes
    }
    this.auditLogs.push(log)
    console.log(`[MessengerStateMachine] Job ${jobId} transitioned: ${fromState} ➔ ${toState} (${notes || "No details"})`)
  }

  public getJobState(jobId: string): MessengerJobState {
    return this.states.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string): MessengerStateTransitionLog[] {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
