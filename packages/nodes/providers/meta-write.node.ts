import { z } from "zod"
import { NodeDefinition } from "../sdk/node-definition"

export const MetaCreateCampaignNode: NodeDefinition = {
  id: "meta-create-campaign",
  name: "Meta Create Campaign",
  provider: "meta",
  category: "ACTION",
  version: "1.0.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    name: z.string().min(1, "Campaign name is required"),
    objective: z.enum(["OUTCOME_LEADS", "OUTCOME_SALES", "OUTCOME_TRAFFIC", "OUTCOME_AWARENESS"]),
    status: z.enum(["ACTIVE", "PAUSED"]).default("PAUSED"),
    credentialId: z.string().min(1, "OAuth credential reference is required"),
  }),
  uiMetadata: {},
}

export const MetaUpdateBudgetNode: NodeDefinition = {
  id: "meta-update-budget",
  name: "Meta Update Budget",
  provider: "meta",
  category: "ACTION",
  version: "1.0.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    adSetId: z.string().min(1, "Ad Set ID is required"),
    dailyBudget: z.number().min(100, "Daily budget must be at least $1.00 (100 cents)"),
    credentialId: z.string().min(1, "OAuth credential reference is required"),
  }),
  uiMetadata: {},
}

export const MetaCreateAdNode: NodeDefinition = {
  id: "meta-create-ad",
  name: "Meta Create Ad",
  provider: "meta",
  category: "ACTION",
  version: "1.0.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    name: z.string().min(1, "Ad name is required"),
    adsetId: z.string().min(1, "Ad Set ID is required"),
    creativeId: z.string().min(1, "Creative ID reference is required"),
    credentialId: z.string().min(1, "OAuth credential reference is required"),
  }),
  uiMetadata: {},
}
