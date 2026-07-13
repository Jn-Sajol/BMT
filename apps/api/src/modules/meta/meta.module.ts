import { Module } from '@nestjs/common';
import { MetaAuthController } from './presentation/meta-auth.controller';
import { CampaignPublishController } from './presentation/campaign-publish.controller';
import { AdSetPublishController } from './presentation/adset-publish.controller';
import { AdCreativePublishController } from './presentation/adcreative-publish.controller';
import { AdPublishController } from './presentation/ad-publish.controller';
import { MetaInsightsController } from './presentation/meta-insights.controller';
import { MetaStatusController } from './presentation/meta-status.controller';
import { CampaignLifecycleController } from './presentation/campaign-lifecycle.controller';
import { AdSetLifecycleController } from './presentation/adset-lifecycle.controller';
import { AdCreativeLifecycleController } from './presentation/adcreative-lifecycle.controller';
import { AdLifecycleController } from './presentation/ad-lifecycle.controller';
import { MetaAuthService } from './application/services/meta-auth.service';
import { MetaAssetSyncService } from './application/services/meta-asset-sync.service';
import { MetaBusinessService } from './application/services/meta-business.service';
import { MetaPageService } from './application/services/meta-page.service';
import { MetaAdAccountService } from './application/services/meta-ad-account.service';
import { MetaInstagramService } from './application/services/meta-instagram.service';
import { MetaPixelService } from './application/services/meta-pixel.service';
import { MetaCatalogService } from './application/services/meta-catalog.service';
import { MetaRelationshipSyncService } from './application/services/meta-relationship-sync.service';
import { MetaBusinessRelationshipService } from './application/services/meta-business-relationship.service';
import { MetaPageRelationshipService } from './application/services/meta-page-relationship.service';
import { MetaAdAccountRelationshipService } from './application/services/meta-ad-account-relationship.service';
import { CampaignPublishService } from './application/services/campaign-publish.service';
import { CampaignPublisher } from './application/services/campaign-publisher';
import { AdSetPublishService } from './application/services/adset-publish.service';
import { AdSetPublisher } from './application/services/adset-publisher';
import { AdCreativePublishService } from './application/services/adcreative-publish.service';
import { AdCreativePublisher } from './application/services/adcreative-publisher';
import { AdPublishService } from './application/services/ad-publish.service';
import { MetaAdPublisher } from './application/services/ad-publisher';
import { MetaInsightsService } from './application/services/meta-insights.service';
import { MetaInsightsSyncService } from './application/services/meta-insights-sync.service';
import { MetaGraphInsightsClient } from './application/services/meta-graph-insights-client';
import { MetaStatusSyncService } from './application/services/meta-status-sync.service';
import { MetaGraphStatusClient } from './application/services/meta-graph-status-client';
import { CampaignLifecycleService } from './application/services/campaign-lifecycle.service';
import { CampaignLifecyclePublisher } from './application/services/campaign-lifecycle-publisher';
import { AdSetLifecycleService } from './application/services/adset-lifecycle.service';
import { AdSetLifecyclePublisher } from './application/services/adset-lifecycle-publisher';
import { AdCreativeLifecycleService } from './application/services/adcreative-lifecycle.service';
import { AdCreativeLifecyclePublisher } from './application/services/adcreative-creative-publisher';
import { AdLifecycleService } from './application/services/ad-lifecycle.service';
import { AdLifecyclePublisher } from './application/services/ad-lifecycle-publisher';
import { MetaOutboxPublisher } from './application/services/meta-outbox-publisher';
import { MetaOAuthProvider } from './infrastructure/oauth/meta-oauth-provider';
import { MetaGraphClient } from './infrastructure/oauth/meta-graph-client';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../../application/auth/auth.module';

@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [
    MetaAuthController,
    CampaignPublishController,
    AdSetPublishController,
    AdCreativePublishController,
    AdPublishController,
    MetaInsightsController,
    MetaStatusController,
    CampaignLifecycleController,
    AdSetLifecycleController,
    AdCreativeLifecycleController,
    AdLifecycleController,
  ],
  providers: [
    MetaAuthService,
    MetaAssetSyncService,
    MetaBusinessService,
    MetaPageService,
    MetaAdAccountService,
    MetaInstagramService,
    MetaPixelService,
    MetaCatalogService,
    MetaRelationshipSyncService,
    MetaBusinessRelationshipService,
    MetaPageRelationshipService,
    MetaAdAccountRelationshipService,
    CampaignPublishService,
    CampaignPublisher,
    AdSetPublishService,
    AdSetPublisher,
    AdCreativePublishService,
    AdCreativePublisher,
    AdPublishService,
    MetaAdPublisher,
    MetaInsightsService,
    MetaInsightsSyncService,
    MetaGraphInsightsClient,
    MetaStatusSyncService,
    MetaGraphStatusClient,
    CampaignLifecycleService,
    CampaignLifecyclePublisher,
    AdSetLifecycleService,
    AdSetLifecyclePublisher,
    AdCreativeLifecycleService,
    AdCreativeLifecyclePublisher,
    AdLifecycleService,
    AdLifecyclePublisher,
    MetaOutboxPublisher,
    MetaGraphClient,
    {
      provide: 'META_OAUTH_PROVIDER',
      useClass: MetaOAuthProvider,
    },
  ],
  exports: [
    MetaAuthService,
    MetaAssetSyncService,
    MetaRelationshipSyncService,
    CampaignPublishService,
    AdSetPublishService,
    AdCreativePublishService,
    AdPublishService,
    MetaBusinessService,
    MetaPageService,
    MetaAdAccountService,
    MetaInstagramService,
    MetaPixelService,
    MetaCatalogService,
    MetaBusinessRelationshipService,
    MetaPageRelationshipService,
    MetaAdAccountRelationshipService,
    MetaInsightsService,
    MetaInsightsSyncService,
    MetaStatusSyncService,
    CampaignLifecycleService,
    AdSetLifecycleService,
    AdCreativeLifecycleService,
    AdLifecycleService,
    MetaOutboxPublisher,
  ],
})
export class MetaModule {}
