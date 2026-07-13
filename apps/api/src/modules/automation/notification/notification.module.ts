import { Module } from '@nestjs/common';
import { TemplateEngineService } from './application/services/template-engine.service';
import { ProviderRegistryService } from './application/services/provider-registry.service';
import { NotificationPreferenceService } from './application/services/notification-preference.service';
import { NotificationPipelineService } from './application/services/notification-pipeline.service';
import { NotificationController } from './presentation/notification.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [NotificationController],
  providers: [
    TemplateEngineService,
    ProviderRegistryService,
    NotificationPreferenceService,
    NotificationPipelineService,
  ],
  exports: [
    TemplateEngineService,
    ProviderRegistryService,
    NotificationPreferenceService,
    NotificationPipelineService,
  ],
})
export class NotificationModule {}
