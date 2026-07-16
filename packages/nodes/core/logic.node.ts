import { z } from "zod"
import { NodeDefinition } from "../sdk/node-definition"

export const LogicNodeDefinition: NodeDefinition = {
  id: "logic-condition",
  name: "If/Else Condition",
  provider: "core",
  category: "CONDITION",
  version: "1.0.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    expression: z.string().min(1, "Expression must not be empty."),
  }),
  uiMetadata: {
    expression: {
      label: "Condition Expression",
      type: "textarea",
      description: "JavaScript style evaluation logic, e.g. input.cpc > 1.20",
    },
  },
}
