import { Module } from '@nestjs/common';
import { CampaignController } from '../../presentation/campaign/campaign.controller';
import { CampaignService } from '../services/campaign.service';
import { CampaignValidationService } from '../services/campaign-validation.service';
import { CampaignHistoryService } from '../services/campaign-history.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [CampaignController],
  providers: [
    CampaignService,
    CampaignValidationService,
    CampaignHistoryService,
  ],
  exports: [
    CampaignService,
    CampaignHistoryService,
  ],
})
export class CampaignModule {}
