import { Module } from '@nestjs/common';
import { WebhookController } from './presentation/webhook.controller';
import { WebhookDispatcher } from './application/services/webhook-dispatcher.service';
import { MetaWebhookHandler } from './infrastructure/handlers/meta-webhook.handler';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';

@Module({
  imports: [DatabaseModule, SecurityModule],
  controllers: [WebhookController],
  providers: [
    WebhookDispatcher,
    MetaWebhookHandler,
    {
      provide: 'WEBHOOK_HANDLERS',
      useFactory: (metaHandler: MetaWebhookHandler) => {
        return [metaHandler];
      },
      inject: [MetaWebhookHandler],
    },
  ],
  exports: [WebhookDispatcher],
})
export class WebhookModule {}
