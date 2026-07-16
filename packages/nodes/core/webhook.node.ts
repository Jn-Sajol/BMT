import { z } from "zod"
import { NodeDefinition } from "../sdk/node-definition"

export const WebhookNodeDefinition: NodeDefinition = {
  id: "webhook-trigger",
  name: "Webhook Endpoint",
  provider: "core",
  category: "TRIGGER",
  version: "1.0.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    path: z.string().min(1, "Path suffix is required."),
    method: z.enum(["GET", "POST", "PUT"]),
    apiKeyRef: z.object({ credentialId: z.string() }).optional(),
  }),
  uiMetadata: {
    path: {
      label: "Webhook Path",
      type: "text",
      description: "Path suffix that triggers this rule, e.g. /v1/events",
    },
    method: {
      label: "HTTP Method",
      type: "select",
      options: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
      ],
    },
    apiKeyRef: {
      label: "API Access Key Ref",
      type: "secret",
      description: "Select workspace API credential reference for headers validation.",
    },
  },
}
