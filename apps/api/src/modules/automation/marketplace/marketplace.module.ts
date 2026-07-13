import { Module } from '@nestjs/common';
import { MarketplaceService } from './application/services/marketplace.service';
import { TemplateSearchService } from './application/services/template-search.service';
import { TemplatePublisherService } from './application/services/template-publisher.service';
import { TemplateInstallerService } from './application/services/template-installer.service';
import { TemplateVersionService } from './application/services/template-version.service';
import { TemplateReviewService } from './application/services/template-review.service';
import { TemplateAnalyticsService } from './application/services/template-analytics.service';
import { SignatureVerifierService } from './application/services/signature-verifier.service';
import { MarketplaceController } from './presentation/marketplace.controller';
import { ActionModule } from '../action/action.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ActionModule],
  controllers: [MarketplaceController],
  providers: [
    MarketplaceService,
    TemplateSearchService,
    TemplatePublisherService,
    TemplateInstallerService,
    TemplateVersionService,
    TemplateReviewService,
    TemplateAnalyticsService,
    SignatureVerifierService,
    {
      provide: 'ITemplateInstaller',
      useClass: TemplateInstallerService,
    },
    {
      provide: 'ISignatureVerifier',
      useClass: SignatureVerifierService,
    },
    {
      provide: 'ITemplateSearch',
      useClass: TemplateSearchService,
    },
    {
      provide: 'ITemplateVersioning',
      useClass: TemplateVersionService,
    },
  ],
  exports: [
    MarketplaceService,
    TemplateSearchService,
    TemplatePublisherService,
    TemplateInstallerService,
    TemplateVersionService,
    TemplateReviewService,
    TemplateAnalyticsService,
    SignatureVerifierService,
    'ITemplateInstaller',
    'ISignatureVerifier',
    'ITemplateSearch',
    'ITemplateVersioning',
  ],
})
export class MarketplaceModule {}
