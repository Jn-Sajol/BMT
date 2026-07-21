import { AutomationJob } from "./automation-core.model"

export interface IExecutionStrategy {
  execute(job: AutomationJob): Promise<{ success: boolean; result?: any }>
}
