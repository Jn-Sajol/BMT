import { Module } from '@nestjs/common';
import { AdController } from './presentation/ad.controller';
import { AdService } from './services/ad.service';
import { AdValidationService } from './services/ad-validation.service';
import { AdHistoryService } from './services/ad-history.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [AdController],
  providers: [
    AdService,
    AdValidationService,
    AdHistoryService,
  ],
  exports: [
    AdService,
    AdHistoryService,
  ],
})
export class AdModule {}
