import { z } from "zod"

export type NodeCategory =
  | "TRIGGER"
  | "ACTION"
  | "CONDITION"
  | "LOGIC"
  | "AI"
  | "DELAY"
  | "PROVIDER"

export interface PropertyUiMetadata {
  label: string
  type: "text" | "password" | "textarea" | "select" | "checkbox" | "switch" | "slider" | "code" | "secret"
  description?: string
  options?: { label: string; value: string }[]
}

export interface NodeDefinition {
  id: string
  name: string
  provider: string
  category: NodeCategory
  version: string
  minEngineVersion: string
  deprecated?: boolean
  experimental?: boolean
  propertiesSchema: z.ZodObject<any>
  uiMetadata: Record<string, PropertyUiMetadata>
}
