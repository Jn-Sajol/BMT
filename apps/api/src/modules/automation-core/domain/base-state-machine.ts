export abstract class BaseStateMachine<TState extends string> {
  protected states = new Map<string, TState>()
  protected auditLogs: Array<{
    jobId: string
    fromState: TState | "Created"
    toState: TState
    timestamp: Date
    notes?: string
  }> = []

  public async transition(jobId: string, toState: TState, notes?: string): Promise<void> {
    const fromState = this.states.get(jobId) || "Created"
    this.states.set(jobId, toState)
    this.auditLogs.push({
      jobId,
      fromState,
      toState,
      timestamp: new Date(),
      notes
    })
    console.log(`[BaseStateMachine] Job ${jobId} transitioned: ${fromState} ➔ ${toState} (${notes || "No details"})`)
  }

  public getJobState(jobId: string): TState | "Created" {
    return this.states.get(jobId) || "Created"
  }

  public getAuditTimeline(jobId: string) {
    return this.auditLogs.filter(l => l.jobId === jobId)
  }
}
