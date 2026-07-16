import { WorkflowNodeType } from "../types"

export const NodeTypeRegistry = {
  supportedTypes: new Set<WorkflowNodeType>([
    "TRIGGER",
    "ACTION",
    "CONDITION",
    "DELAY",
    "LOOP",
    "AI",
    "VARIABLE",
    "MERGE",
    "SPLIT",
    "WEBHOOK",
    "HTTP_REQUEST",
    "NOTIFICATION",
    "DATABASE",
    "SCHEDULE",
  ]),

  isSupported: (type: string): boolean => {
    return NodeTypeRegistry.supportedTypes.has(type as WorkflowNodeType)
  },
}
