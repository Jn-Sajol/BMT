import { z } from "zod"
import { NodeDefinition } from "../sdk/node-definition"

export const OpenAiNodeDefinition: NodeDefinition = {
  id: "openai-prompt",
  name: "OpenAI Text Completion",
  provider: "OpenAI",
  category: "AI",
  version: "1.1.0",
  minEngineVersion: "1.0.0",
  propertiesSchema: z.object({
    prompt: z.string().min(1, "Prompt cannot be empty."),
    temperature: z.number().min(0).max(2).default(0.7),
    apiKeyRef: z.object({ credentialId: z.string() }),
  }),
  uiMetadata: {
    prompt: {
      label: "AI Prompt",
      type: "textarea",
    },
    temperature: {
      label: "Temperature",
      type: "slider",
    },
    apiKeyRef: {
      label: "OpenAI Key Ref",
      type: "secret",
    },
  },
}
