import { IPlugin } from "./plugin.interface"
import { PluginRegistry } from "./plugin-registry"

export class PluginLoader {
  public static async loadPlugin(plugin: IPlugin, registries: Record<string, any>): Promise<boolean> {
    try {
      console.log(`[PluginLoader] Initializing plugin: ${plugin.manifest.name}`)
      await plugin.initialize()

      console.log(`[PluginLoader] Registering plugin nodes: ${plugin.manifest.name}`)
      await plugin.register(registries)

      console.log(`[PluginLoader] Starting plugin: ${plugin.manifest.name}`)
      await plugin.start()

      PluginRegistry.register(plugin)
      return true
    } catch (err: any) {
      console.error(`[PluginLoader] Failed to load plugin ${plugin.manifest.name}: ${err.message}`)
      // Graceful isolation: return false to prevent platform crashes
      return false
    }
  }

  public static async unloadPlugin(pluginId: string): Promise<void> {
    try {
      const plugin = PluginRegistry.resolve(pluginId)
      await plugin.stop()
      await plugin.dispose()
    } catch (err: any) {
      console.error(`[PluginLoader] Failed to unload plugin ${pluginId}: ${err.message}`)
    }
  }
}
