import { z } from "zod"
import { NodeDefinition } from "../sdk/node-definition"

export const MetaNodeDefinition: NodeDefinition = {
  id: "meta-adjust-budget",
  name: "Adjust Meta Campaign Budget",
  provider: "Meta",
  category: "ACTION",
  version: "1.0.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    campaignId: z.string().min(1, "Campaign ID is required."),
    budgetAdjustment: z.number().min(-100).max(100),
    authRef: z.object({ credentialId: z.string() }),
  }),
  uiMetadata: {
    campaignId: {
      label: "Campaign ID",
      type: "text",
    },
    budgetAdjustment: {
      label: "Adjustment Percentage (%)",
      type: "slider",
      description: "Percent change in budget, can be negative to decrease.",
    },
    authRef: {
      label: "OAuth Authentication",
      type: "secret",
    },
  },
}
