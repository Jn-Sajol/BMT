import { Module } from '@nestjs/common';
import { AdCreativeController } from './presentation/adcreative.controller';
import { AdCreativeService } from './services/adcreative.service';
import { AdCreativeValidationService } from './services/adcreative-validation.service';
import { AdCreativeHistoryService } from './services/adcreative-history.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [AdCreativeController],
  providers: [
    AdCreativeService,
    AdCreativeValidationService,
    AdCreativeHistoryService,
  ],
  exports: [
    AdCreativeService,
    AdCreativeHistoryService,
  ],
})
export class AdCreativeModule {}
