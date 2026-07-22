import { Injectable } from "@nestjs/common"
import { AutomationCapability, AutomationPlugin, PlatformDriver } from "../../domain/automation-plugin.model"

@Injectable()
export class AutomationRegistryService {
  private plugins = new Map<string, AutomationPlugin>()
  private drivers = new Map<string, PlatformDriver>()

  public registerPlugin(plugin: AutomationPlugin): void {
    this.plugins.set(plugin.metadata.id, plugin)
    console.log(`[AutomationRegistry] Registered plugin: ${plugin.metadata.name} (v${plugin.metadata.version}, Platform: ${plugin.metadata.platform})`)
  }

  public getPlugin(pluginId: string): AutomationPlugin | undefined {
    return this.plugins.get(pluginId)
  }

  public getPluginByCapability(platform: string, capability: AutomationCapability): AutomationPlugin | undefined {
    return Array.from(this.plugins.values()).find(
      (p) => p.isEnabled && p.metadata.platform === platform && p.capabilities.includes(capability)
    )
  }

  public enablePlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId)
    if (plugin) {
      plugin.isEnabled = true
      console.log(`[AutomationRegistry] Enabled plugin ${pluginId}`)
    }
  }

  public disablePlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId)
    if (plugin) {
      plugin.isEnabled = false
      console.log(`[AutomationRegistry] Disabled plugin ${pluginId}`)
    }
  }

  public listPlugins(): AutomationPlugin[] {
    return Array.from(this.plugins.values())
  }

  public registerDriver(driver: PlatformDriver): void {
    this.drivers.set(driver.platformId, driver)
    console.log(`[AutomationRegistry] Registered platform driver: ${driver.platformName} (v${driver.version})`)
  }

  public getDriver(platformId: string): PlatformDriver | undefined {
    return this.drivers.get(platformId)
  }

  public listDrivers(): PlatformDriver[] {
    return Array.from(this.drivers.values())
  }
}
