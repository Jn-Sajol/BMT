import { PluginManifest } from "./plugin-manifest"

export interface IPlugin {
  manifest: PluginManifest
  initialize: () => Promise<void>
  register: (registries: Record<string, any>) => Promise<void>
  start: () => Promise<void>
  stop: () => Promise<void>
  dispose: () => Promise<void>
}
