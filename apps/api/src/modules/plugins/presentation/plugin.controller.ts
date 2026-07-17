import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import { PluginManagerService } from "../application/services/plugin-manager.service"
import { PluginManifest } from "plugin-sdk"

@Controller("plugins")
export class PluginController {
  constructor(private readonly manager: PluginManagerService) {}

  @Get("available")
  getAvailable() {
    return this.manager.getAvailable()
  }

  @Get("installed")
  getInstalled() {
    return this.manager.getInstalled().map((p) => p.manifest)
  }

  @Post("install")
  install(@Body() manifest: PluginManifest) {
    return this.manager.installPlugin(manifest)
  }

  @Post(":id/uninstall")
  uninstall(@Param("id") pluginId: string) {
    return this.manager.uninstallPlugin(pluginId)
  }
}
