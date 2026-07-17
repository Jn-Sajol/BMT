import { IPlugin } from "./plugin.interface"

export class PluginRegistry {
  private static plugins = new Map<string, IPlugin>()

  public static register(plugin: IPlugin): void {
    const manifest = plugin.manifest
    // Validate version compatibility
    if (parseFloat(manifest.minPlatformVersion) > 1.0) {
      throw new Error(`Plugin ${manifest.name} requires platform version ${manifest.minPlatformVersion} or higher.`)
    }

    PluginRegistry.plugins.set(manifest.id.toLowerCase(), plugin)
  }

  public static resolve(pluginId: string): IPlugin {
    const plugin = PluginRegistry.plugins.get(pluginId.toLowerCase())
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not loaded.`)
    }
    return plugin
  }

  public static list(): IPlugin[] {
    return Array.from(PluginRegistry.plugins.values())
  }

  public static clear(): void {
    PluginRegistry.plugins.clear()
  }
}
