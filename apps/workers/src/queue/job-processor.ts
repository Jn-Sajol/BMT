import { Job } from "bullmq"
import { WorkflowRunner } from "automation-nodes"

export async function processWorkflowJob(job: Job): Promise<any> {
  const { workflowId, executionId, nodes, edges, variables } = job.data

  if (!workflowId || !executionId || !nodes || !edges) {
    throw new Error("Missing parameters in execution job payload.")
  }

  console.log(`[Processor] Processing job ${job.id} for execution ID: ${executionId}`)

  // Run topological execution engine
  const result = await WorkflowRunner.execute(
    workflowId,
    executionId,
    nodes,
    edges,
    variables || {}
  )

  if (result.status === "FAILED") {
    throw new Error(`Workflow execution failed: ${result.logs.join(" | ")}`)
  }

  return {
    status: "COMPLETED",
    nodeOutputs: result.nodeOutputs,
    logs: result.logs,
  }
}
