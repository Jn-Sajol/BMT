import { Module } from '@nestjs/common';
import { AdSetController } from './presentation/adset.controller';
import { AdSetService } from './services/adset.service';
import { AdSetValidationService } from './services/adset-validation.service';
import { AdSetHistoryService } from './services/adset-history.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, SecurityModule, AuthModule],
  controllers: [AdSetController],
  providers: [
    AdSetService,
    AdSetValidationService,
    AdSetHistoryService,
  ],
  exports: [
    AdSetService,
    AdSetHistoryService,
  ],
})
export class AdSetModule {}
