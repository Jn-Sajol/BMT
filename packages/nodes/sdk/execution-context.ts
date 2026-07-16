import { WorkflowExecutionContext } from "./node-executor"

export class ExecutionContext implements WorkflowExecutionContext {
  public logs: string[] = []

  constructor(
    public readonly workflowId: string,
    public readonly executionId: string,
    public readonly variables: Record<string, any> = {},
    public readonly nodeOutputs: Record<string, any> = {}
  ) {}

  public log(message: string): void {
    this.logs.push(`[${new Date().toISOString()}] ${message}`)
  }

  public resolveVariables(text: string): string {
    // Regex matching {{expression}}
    return text.replace(/\{\{([^}]+)\}\}/g, (_, expression) => {
      const path = expression.trim()
      const resolved = this.getValueByPath(path)
      return resolved !== undefined ? String(resolved) : `{{${path}}}`
    })
  }

  private getValueByPath(path: string): any {
    const segments = path.split(".")
    let current: any = null

    if (segments[0] === "trigger" && segments[1] === "payload") {
      current = this.variables.trigger?.payload
      return this.resolveNested(current, segments.slice(2))
    }

    if (segments[0] === "workflow" && segments[1] === "variables") {
      current = this.variables
      return this.resolveNested(current, segments.slice(2))
    }

    // Resolves {{node-id.output.property}}
    const nodeId = segments[0]
    if (this.nodeOutputs[nodeId]) {
      current = this.nodeOutputs[nodeId]
      if (segments[1] === "output") {
        return this.resolveNested(current, segments.slice(2))
      }
      return this.resolveNested(current, segments.slice(1))
    }

    return undefined
  }

  private resolveNested(obj: any, segments: string[]): any {
    let current = obj
    for (const segment of segments) {
      if (current && typeof current === "object" && segment in current) {
        current = current[segment]
      } else {
        return undefined
      }
    }
    return current
  }
}
