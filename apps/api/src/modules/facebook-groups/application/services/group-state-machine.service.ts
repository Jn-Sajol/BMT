import { Injectable } from "@nestjs/common"

export type GroupJobState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

export interface GroupStateTransitionLog {
  jobId: string
  fromState: GroupJobState
  toState: GroupJobState
  timestamp: Date
  reason?: string
}

@Injectable()
export class GroupStateMachineService {
  private auditLogs: GroupStateTransitionLog[] = []
  private states = new Map<string, GroupJobState>()

  public async transition(jobId: string, toState: GroupJobState, reason?: string): Promise<void> {
    const fromState = this.states.get(jobId) || "Created"
    this.states.set(jobId, toState)

    const log: GroupStateTransitionLog = {
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      reason
    }
    this.auditLogs.push(log)
    console.log(`[GroupStateMachine] Job ${jobId} transitioned: ${fromState} ➔ ${toState} (${reason || "No reason"})`)
  }

  public getJobState(jobId: string): GroupJobState {
    return this.states.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string): GroupStateTransitionLog[] {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
