import { Injectable } from "@nestjs/common"

export type MarketExecutionState = "Created" | "Prepared" | "Waiting" | "Running" | "Verifying" | "Completed" | "Failed"

export interface StateTransitionLog {
  jobId: string
  fromState: MarketExecutionState
  toState: MarketExecutionState
  timestamp: Date
  notes?: string
}

@Injectable()
export class MarketStateMachineService {
  private auditLogs: StateTransitionLog[] = []
  private stateRegistry = new Map<string, MarketExecutionState>()

  public async transition(jobId: string, toState: MarketExecutionState, notes?: string): Promise<void> {
    const fromState = this.stateRegistry.get(jobId) || "Created"
    this.stateRegistry.set(jobId, toState)

    const log: StateTransitionLog = {
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      notes
    }
    this.auditLogs.push(log)
    console.log(`[MarketStateMachine] Job ID ${jobId} transitioned: ${fromState} ➔ ${toState} (${notes || "No details"})`)
  }

  public getJobState(jobId: string): MarketExecutionState {
    return this.stateRegistry.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string): StateTransitionLog[] {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
