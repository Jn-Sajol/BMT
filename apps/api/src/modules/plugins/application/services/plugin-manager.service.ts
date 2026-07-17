import { Injectable, OnModuleInit } from "@nestjs/common"
import { IPlugin, PluginManifest, PluginLoader, PluginRegistry } from "plugin-sdk"

@Injectable()
export class PluginManagerService implements OnModuleInit {
  private installedPlugins: string[] = []
  private availablePlugins: PluginManifest[] = [
    {
      id: "slack-plugin",
      name: "Slack Integration Channel",
      version: "1.0.0",
      author: "Official",
      description: "Send channel slack messages from workflows",
      category: "Messaging",
      minPlatformVersion: "1.0",
      supportedPlatformVersion: "1.0",
      license: "MIT",
      permissions: ["network", "notifications"],
      dependencies: [],
    },
    {
      id: "premium-shopify",
      name: "Shopify Store Sync",
      version: "1.1.0",
      author: "Community",
      description: "Trigger automations on store orders",
      category: "E-Commerce",
      minPlatformVersion: "1.0",
      supportedPlatformVersion: "1.0",
      license: "Commercial",
      permissions: ["network", "webhooks"],
      dependencies: [],
    },
  ]

  onModuleInit() {
    // Platform start
    console.log("[PluginManagerService] Initializing Marketplace Plugin SDK.")
  }

  public getAvailable(): PluginManifest[] {
    return this.availablePlugins
  }

  public getInstalled(): IPlugin[] {
    return PluginRegistry.list()
  }

  public async installPlugin(manifest: PluginManifest): Promise<{ success: boolean; message: string }> {
    // 1. Verify Version Compatibility
    if (parseFloat(manifest.minPlatformVersion) > 1.0) {
      return { success: false, message: `Version mismatch. Platform requires v${manifest.minPlatformVersion}.` }
    }

    // 2. Build mock plugin wrapper
    const plugin: IPlugin = {
      manifest,
      initialize: async () => console.log(`[Plugin] Initialized ${manifest.name}`),
      register: async (reg) => {
        reg["nodes"] = reg["nodes"] || []
        reg["nodes"].push(`${manifest.id}-node`)
      },
      start: async () => console.log(`[Plugin] Started ${manifest.name}`),
      stop: async () => console.log(`[Plugin] Stopped ${manifest.name}`),
      dispose: async () => console.log(`[Plugin] Disposed ${manifest.name}`),
    }

    // 3. Dynamic Isolated Load preventing crash cascades
    const registries = { nodes: [] }
    const loaded = await PluginLoader.loadPlugin(plugin, registries)

    if (loaded) {
      this.installedPlugins.push(manifest.id)
      return { success: true, message: `Plugin ${manifest.name} installed successfully.` }
    } else {
      return { success: false, message: `Failed to compile/load plugin ${manifest.name}.` }
    }
  }

  public async uninstallPlugin(pluginId: string): Promise<{ success: boolean; message: string }> {
    await PluginLoader.unloadPlugin(pluginId)
    this.installedPlugins = this.installedPlugins.filter((id) => id !== pluginId)
    return { success: true, message: `Plugin ${pluginId} uninstalled successfully.` }
  }
}
