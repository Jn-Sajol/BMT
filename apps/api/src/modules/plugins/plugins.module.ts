import { Module } from "@nestjs/common"
import { PluginController } from "./presentation/plugin.controller"
import { PluginManagerService } from "./application/services/plugin-manager.service"

@Module({
  controllers: [PluginController],
  providers: [PluginManagerService],
  exports: [PluginManagerService],
})
export class PluginsModule {}
