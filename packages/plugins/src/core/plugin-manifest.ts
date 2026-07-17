import { z } from "zod"

export const PluginManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  author: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string().optional(),
  license: z.string(),
  homepage: z.string().optional(),
  documentationUrl: z.string().optional(),
  minPlatformVersion: z.string(),
  supportedPlatformVersion: z.string(),
  dependencies: z.array(z.string()).default([]),
  permissions: z.array(z.enum([
    "network",
    "credentials",
    "vault",
    "ai",
    "providers",
    "files",
    "notifications",
    "webhooks"
  ])).default([])
})

export type PluginManifest = z.infer<typeof PluginManifestSchema>
